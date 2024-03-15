import { computed, defineComponent, markRaw } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { useRoute } from 'vue-router';

import { VueFlow, type Node, type Edge } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';

import { Flex } from 'ant-design-vue';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

import '@fontsource-variable/inter/slnt.css';
import '@fontsource-variable/inter';

import { storeToRefs } from 'pinia';

import { Defined, Optional, isNotUndefined } from '@poolofdeath20/util';

import { ConversationTrigger } from '../components/trigger';
import { SendMessage } from '../components/send-message';
import { DateTime } from '../components/date-time';
import { DateTimeConnector } from '../components/date-time-connector';
import { AddComment } from '../components/add-comment';
import useNodeStore from '../stores/nodes';
import { generateNodesPositions } from '../logic/util';
import { size } from '../const';

type Type = Readonly<{
	type: string;
}>;

const findMatchingNode = (left: Type) => {
	return (right: Type) => {
		return (
			left.type === right.type || left.type.startsWith(`${right.type}-`)
		);
	};
};

const Home = defineComponent({
	name: 'home',
	setup() {
		const route = useRoute();

		const paramId = computed(() => {
			return Optional.from(route.params.id).flatMap((id) => {
				if (typeof id === 'string') {
					return Optional.some(id);
				}

				return Optional.none<string>();
			});
		});

		const nodestore = useNodeStore();
		const { nodes, edges } = storeToRefs(nodestore);

		const getElementName = (element: (typeof nodes.value)[0]) => {
			return Defined.parse(element.name).orThrow(
				`name for ${element.type} is not defined`
			);
		};

		const charts = [
			ConversationTrigger(),
			SendMessage(),
			DateTime(),
			DateTimeConnector(),
			AddComment(),
		];

		const colorsWithType = charts
			.map(({ type }) => {
				switch (type) {
					case 'trigger': {
						return {
							type,
							color: '#D2678F',
						};
					}
					case 'sendMessage': {
						return {
							type,
							color: '#67B6AD',
						};
					}
					case 'dateTimeConnector':
					case 'dateTime': {
						return {
							type,
							color: '#FFB8A3',
						};
					}
					case 'addComment': {
						return {
							type,
							color: '#A0A9D7',
						};
					}
				}
			})
			.filter(isNotUndefined);

		const nodeTypes = computed(() => {
			return nodes.value
				.map((node) => {
					const Component = Defined.parse(
						charts.find(findMatchingNode(node))
					)
						.map((chart) => {
							const name = getElementName(node);

							const { color } = Defined.parse(
								colorsWithType.find(findMatchingNode(node))
							).orThrow(
								`color for "${node.type}" is not defined`
							);

							const id = node.id.toString();

							const props = {
								id,
								title: name,
								size,
								color,
							};

							switch (chart.type) {
								case 'trigger': {
									return (
										<chart.Component
											{...props}
											value={Defined.parse(
												node.data.type
											).orThrow(
												'type for trigger is not defined'
											)}
											onChange={nodestore.updateTrigger}
										/>
									);
								}
								case 'sendMessage': {
									return (
										<chart.Component
											{...props}
											onChange={
												nodestore.updateSendMessages
											}
											payload={Defined.parse(
												node.data.payload
											)
												.map((payload) => {
													return payload.map(
														(payload) => {
															if (payload.text) {
																return {
																	type: 'text',
																	text: payload.text,
																} as const;
															}

															if (
																payload.attachment
															) {
																return {
																	type: 'attachment',
																	attachment:
																		payload.attachment,
																} as const;
															}

															throw new Error(
																'payload for sendMessage is not defined'
															);
														}
													);
												})
												.orThrow(
													'payload for sendMessage is not defined'
												)}
										/>
									);
								}
								case 'dateTime': {
									return (
										<chart.Component
											{...props}
											value={Defined.parse(
												node.timezone
											).orThrow(
												'timezone for dateTime is not defined'
											)}
										/>
									);
								}
								case 'dateTimeConnector': {
									return <chart.Component status={name} />;
								}
								case 'addComment': {
									return (
										<chart.Component
											{...props}
											value={Defined.parse(
												node.data.comment
											).orThrow(
												'comment for addComment is not defined'
											)}
										/>
									);
								}
							}
						})
						.map(markRaw)
						.orThrow(`chart for "${node.type}" is not defined`);

					return {
						[node.type]: Component,
					};
				})
				.reduce(
					(accumulator, current) => {
						return {
							...accumulator,
							...current,
						};
					},
					{} as Record<string, JSX.Element>
				);
		});

		const edgesFlowChart = computed(() => {
			return edges.value.map((edge) => {
				return {
					...edge,
					type: 'smoothstep',
					style: {
						stroke: colorsWithType.find(findMatchingNode(edge))
							?.color,
					},
				} satisfies Edge;
			});
		});

		const drawers = computed(() => {
			return nodes.value.map((node) => {
				const Component = Defined.parse(
					charts.find((chart) => {
						return (
							node.type === chart.type ||
							node.type.startsWith(`${chart.type}-`)
						);
					})
				)
					.map((chart) => {
						const name = getElementName(node);

						const id = node.id.toString();

						const props = {
							paramId: paramId.value,
							id,
							title: name,
						};

						switch (chart.type) {
							case 'trigger': {
								return (
									<chart.Drawer
										{...props}
										value={Defined.parse(
											node.data.type
										).orThrow(
											'type for trigger is not defined'
										)}
										onChange={nodestore.updateTrigger}
									/>
								);
							}
							case 'sendMessage': {
								return (
									<chart.Drawer
										{...props}
										onChange={nodestore.updateSendMessages}
										payload={Defined.parse(
											node.data.payload
										)
											.map((payload) => {
												return payload.map(
													(payload) => {
														if (payload.text) {
															return {
																type: 'text',
																text: payload.text,
															} as const;
														}

														if (
															payload.attachment
														) {
															return {
																type: 'attachment',
																attachment:
																	payload.attachment,
															} as const;
														}

														throw new Error(
															'payload for sendMessage is not defined'
														);
													}
												);
											})
											.orThrow(
												'payload for sendMessage is not defined'
											)}
									/>
								);
							}
							case 'dateTime': {
								return (
									<chart.Drawer
										{...props}
										businessHourTimes={
											nodestore.businessHourTimes
										}
										businessHourTimezone={
											nodestore.businessHourTimezone
										}
										updateTimezone={
											nodestore.updateTimezone
										}
										updateBusinessHourTimes={
											nodestore.updateBusinessHourTimes
										}
									/>
								);
							}
							case 'addComment': {
								return (
									<chart.Drawer
										{...props}
										value={Defined.parse(
											node.data.comment
										).orThrow(
											'comment for addComment is not defined'
										)}
										onChange={nodestore.updateComment}
									/>
								);
							}
							case 'dateTimeConnector': {
								return <></>;
							}
						}
					})
					.orThrow(`chart for "${node.type}" is not defined`);

				return Component;
			});
		});

		return () => {
			return (
				<Flex
					gap={8}
					style={{
						fontFamily: `'Inter Variable', sans-serif`,
						height: '100vh',
						width: '100%',
					}}
				>
					<VueFlow
						fitViewOnInit
						nodes={nodes.value}
						edges={edgesFlowChart.value}
						nodeTypes={nodeTypes.value}
						onNodeDrag={(event) => {
							nodestore.updateNodePosition(event.node);
						}}
					>
						<Background pattern-color="#121212" gap={24} />
						<MiniMap />
					</VueFlow>
					{drawers.value}
				</Flex>
			);
		};
	},
});

export default Home;

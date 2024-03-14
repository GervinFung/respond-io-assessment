import { computed, defineComponent, markRaw } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { VueFlow, type Node, type Edge } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

import '@fontsource-variable/inter/slnt.css';
import '@fontsource-variable/inter';

import { Defined, Optional, capitalize } from '@poolofdeath20/util';

import { useRoute } from 'vue-router';

import nodes from '../data/nodes';
import { TextInput } from '../components/input';
import { ConversationTrigger } from '../components/trigger';
import { SendMessage } from '../components/send-message';
import { DateTime } from '../components/date-time';
import { DateTimeConnector } from '../components/date-time-connector';
import { AddComment } from '../components/add-comment';
import useNodeStore from '../stores/nodes';

const Home = defineComponent({
	name: 'home',
	setup() {
		const route = useRoute();

		const paramId = Optional.from(route.params.id)
			.flatMap((id) => {
				if (typeof id === 'string') {
					return Optional.some(id);
				}

				return Optional.none<string>();
			})
			.map((id) => {
				return {
					id,
				};
			});

		const size = {
			width: 250,
			height: 100,
		};

		const elements = useNodeStore(size)();

		const getElementName = (
			element: (typeof elements.$state.nodeList)[0]
		) => {
			return () => {
				return Defined.parse(element.name).orThrow(
					`name for ${element.type} is not defined`
				);
			};
		};

		const charts = [
			ConversationTrigger(),
			SendMessage(),
			DateTime(),
			DateTimeConnector(),
			AddComment(),
		];

		const nodeTypes = elements.$state.nodeList
			.map((element) => {
				const Component = Defined.parse(
					charts.find((chart) => {
						return element.type.startsWith(`${chart.type}-`);
					})
				)
					.map((chart) => {
						const name = getElementName(element);

						const id = element.id.toString();

						switch (chart.type) {
							case 'trigger': {
								return (
									<chart.Component
										id={id}
										value="Conversation Opened"
										size={size}
										param={paramId.unwrapOrGet(undefined)}
									/>
								);
							}
							case 'sendMessage': {
								return (
									<chart.Component
										id={id}
										title={name()}
										value={Defined.parse(
											element.data.payload?.at(0)?.text
										).orThrow(
											'text for sendMessage is not defined'
										)}
										size={size}
										param={paramId.unwrapOrGet(undefined)}
									/>
								);
							}
							case 'dateTime': {
								return (
									<chart.Component
										id={id}
										title={name()}
										value={Defined.parse(
											element.timezone
										).orThrow(
											'timezone for dateTime is not defined'
										)}
										size={size}
										param={paramId.unwrapOrGet(undefined)}
									/>
								);
							}
							case 'dateTimeConnector': {
								return <chart.Component status={name()} />;
							}
							case 'addComment': {
								return (
									<chart.Component
										id={id}
										title={name()}
										value={Defined.parse(
											element.data.comment
										).orThrow(
											'comment for addComment is not defined'
										)}
										size={size}
										param={paramId.unwrapOrGet(undefined)}
									/>
								);
							}
						}
					})
					.map(markRaw)
					.orThrow(`chart for ${element.type} is not defined`);

				return {
					[element.type]: Component,
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

		const nodesFlowChart = computed(() => {
			return elements.$state.nodeList.map((node) => {
				return {
					...node,
					id: node.id.toString(),
					parentNode: node.parentNode?.toString(),
					position: node.computedPosition,
				} satisfies Node;
			});
		});

		const edgesFlowChart = computed(() => {
			return elements.$state.nodeList.map((node) => {
				const source = node.parentNode?.toString() ?? '';
				const target = node.id?.toString() ?? '';

				return {
					id: `${source}-${target}`,
					source,
					target,
					animated: true,
					type: 'smoothstep',
					label: <div>hihi</div>,
					labelStyle: {
						fill: 'white',
						fontWeight: 'bold',
					},
				} satisfies Edge;
			});
		});

		return () => {
			return (
				<div
					style={{
						fontFamily: `'Inter Variable', sans-serif`,
						display: 'flex',
						flexDirection: 'row',
						height: '100vh',
						width: '100%',
						gap: '8px',
					}}
				>
					<div
						style={{
							height: '100%',
							width: '80%',
							border: '1px solid gray',
						}}
					>
						<VueFlow
							nodes={nodesFlowChart.value}
							edges={edgesFlowChart.value}
							fitViewOnInit
							nodeTypes={nodeTypes}
						>
							<Background pattern-color="#121212" gap={24} />
							<MiniMap />
						</VueFlow>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '20%',
							gap: '16px',
						}}
					>
						<h1
							style={{
								margin: '0px',
							}}
						>
							Business Hours
						</h1>
						<div
							style={{
								borderBottom: '1px solid grey',
							}}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							{Defined.parse(
								nodes.find((node) => {
									return node.name === 'Business Hours';
								})
							)
								.map((node) => {
									return Defined.parse(
										node.data.times
									).orThrow(
										'Data at index 2 does not have a times property'
									);
								})
								.map((times) => {
									return times.map((time) => {
										return (
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '16px',
												}}
											>
												<p
													style={{
														fontWeight: 'bold',
													}}
												>
													{capitalize(time.day)}
												</p>
												<TextInput
													value={time.startTime}
													onChange={(startTime) => {
														time.startTime =
															startTime;
													}}
												/>
												<p>to</p>
												<TextInput
													value={time.endTime}
												/>
											</div>
										);
									});
								})
								.orThrow('Business Hours is not defined')}
						</div>
					</div>
				</div>
			);
		};
	},
});

export default Home;

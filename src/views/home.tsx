import { computed, defineComponent, markRaw } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { useRoute } from 'vue-router';

import { VueFlow, type Node, type Edge } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

import '@fontsource-variable/inter/slnt.css';
import '@fontsource-variable/inter';

import { storeToRefs } from 'pinia';

import moment from 'moment';
import 'moment-timezone';

import { Defined, Optional, capitalize } from '@poolofdeath20/util';

import { TextInput } from '../components/input';
import { ConversationTrigger } from '../components/trigger';
import { SendMessage } from '../components/send-message';
import { DateTime } from '../components/date-time';
import { DateTimeConnector } from '../components/date-time-connector';
import { AddComment } from '../components/add-comment';
import useNodeStore from '../stores/nodes';
import { generateNodesPositions } from '../logic/util';

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

		const nodestore = useNodeStore();
		const { nodeList } = storeToRefs(nodestore);

        generateNodesPositions(nodeList.value, size);

		const elements = computed(() => {
			return nodeList.value.map((node, index) => {
				return {
					...node,
					position: {
						x: 50 * index,
						y: 50 * index,
					},
				};
			});
		});

		const getElementName = (element: (typeof elements.value)[0]) => {
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

		const businessHours = Defined.parse(
			nodeList.value.find((node) => {
				return node.name === 'Business Hours';
			})
		).orThrow('Business Hours is not defined');

		const nodeTypes = computed(() => {
			return elements.value
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
											param={paramId.unwrapOrGet(
												undefined
											)}
										/>
									);
								}
								case 'sendMessage': {
									return (
										<chart.Component
											id={id}
											title={name()}
											value={Defined.parse(
												element.data.payload?.at(0)
													?.text
											).orThrow(
												'text for sendMessage is not defined'
											)}
											size={size}
											param={paramId.unwrapOrGet(
												undefined
											)}
										/>
									);
								}
								case 'dateTime': {
									return (
										<chart.Component
											key={businessHours.timezone}
											id={id}
											title={name()}
											value={Defined.parse(
												element.timezone
											).orThrow(
												'timezone for dateTime is not defined'
											)}
											size={size}
											param={paramId.unwrapOrGet(
												undefined
											)}
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
											param={paramId.unwrapOrGet(
												undefined
											)}
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
		});

		const nodesFlowChart = computed(() => {
			return elements.value.map((node) => {
				return {
					...node,
					id: node.id.toString(),
					parentNode: node.parentNode?.toString(),
					position: node.position,
				} satisfies Node;
			});
		});

		const edgesFlowChart = computed(() => {
			return elements.value.map((node) => {
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
							borderRight: '1px solid #C1C1C1',
						}}
					>
						<VueFlow
							fitViewOnInit
							nodes={nodesFlowChart.value}
							edges={edgesFlowChart.value}
							nodeTypes={nodeTypes.value}
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
						<div
							style={{
								padding: '12px',
								borderBottom: '1px solid #C1C1C1',
							}}
						>
							<h1
								style={{
									margin: '0px',
								}}
							>
								Business Hours
							</h1>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: '16px',
								padding: '12px',
							}}
						>
							{Defined.parse(businessHours.data.times)
								.map((times) => {
									return times.map((time) => {
										return (
											<div
												style={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
												}}
											>
												<div
													style={{
														fontWeight: 500,
													}}
												>
													{capitalize(time.day)}
												</div>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '8px',
													}}
												>
													<TextInput
														value={time.startTime}
														onChange={(
															startTime
														) => {
															time.startTime =
																startTime;
														}}
													/>
													<p>-</p>
													<TextInput
														value={time.endTime}
													/>
												</div>
											</div>
										);
									});
								})
								.orThrow(
									'Data at index 2 does not have a times property'
								)}
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: '16px',
								padding: '12px',
							}}
						>
							<div>Timezone</div>
							<select
								style={{
									padding: '8px 12px',
								}}
								value={businessHours.timezone}
								onChange={(event) => {
									const timezone = Defined.parse(event.target)
										.map((target) => {
											if (
												'value' in target &&
												typeof target.value === 'string'
											) {
												return target.value;
											}

											throw new Error(
												'event.target.value is not defined'
											);
										})
										.orThrow(
											'event.target of select is null'
										);

									nodestore.$patch((state) => {
										const index = state.nodeList.findIndex(
											(node) => {
												return (
													node.name ===
													'Business Hours'
												);
											}
										);

										state.nodeList[index].timezone =
											timezone;
									});
								}}
							>
								{moment.tz
									.names()
									.map((name) => {
										const offset = moment
											.tz(name)
											.utcOffset();

										return {
											name,
											offset,
										};
									})
									.sort((a, b) => {
										return a.offset - b.offset;
									})
									.map(({ name }) => {
										const timezone = moment
											.tz(name)
											.format('Z');

										return (
											<option value={name}>
												(GMT{timezone}) {name}
											</option>
										);
									})}
							</select>
						</div>
					</div>
				</div>
			);
		};
	},
});

export default Home;

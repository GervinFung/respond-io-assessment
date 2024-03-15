import { computed, defineComponent, markRaw } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { useRoute } from 'vue-router';

import { VueFlow, type Node, type Edge } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';

import {
	TimeRangePicker,
	Select,
	SelectOption,
	TypographyTitle,
	Divider,
	Col,
	Row,
	Flex,
	TypographyText,
} from 'ant-design-vue';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

import '@fontsource-variable/inter/slnt.css';
import '@fontsource-variable/inter';

import { storeToRefs } from 'pinia';

import moment from 'moment';
import 'moment-timezone';

import { Defined, Optional, capitalize } from '@poolofdeath20/util';

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
											key={nodestore.businessHourTimezone}
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

		const grid = {
			rowLength: 24,
			vueFlow: 20,
		};

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
					<Row
						style={{
							width: '100%',
						}}
					>
						<Col span={grid.vueFlow}>
							<div
								style={{
									height: '100%',
									borderRight: '1px solid #C1C1C1',
								}}
							>
								<VueFlow
									fitViewOnInit
									nodes={nodesFlowChart.value}
									edges={edgesFlowChart.value}
									nodeTypes={nodeTypes.value}
								>
									<Background
										pattern-color="#121212"
										gap={24}
									/>
									<MiniMap />
								</VueFlow>
							</div>
						</Col>
						<Col span={grid.rowLength - grid.vueFlow}>
							<Flex
								gap={8}
								vertical
								style={{
									padding: '24px',
								}}
							>
								<TypographyTitle
									level={2}
									// @ts-expect-error: Style doesn't exists for `TypographyTitle`, but injectable in runtime
									style={{
										margin: 0,
									}}
								>
									Business Hours
								</TypographyTitle>
								<Divider />
								<Flex vertical align="flex-start" gap={16}>
									{nodestore.businessHourTimes.map(
										(time, index) => {
											return (
												<Flex
													vertical
													align="flex-start"
												>
													<TypographyText>
														{capitalize(time.day)}
													</TypographyText>
													<TimeRangePicker
														valueFormat="HH:mm"
														format="HH:mm"
														value={[
															time.startTime,
															time.endTime,
														]}
														style={{
															width: '200px',
														}}
														use12Hours={false}
														onChange={(value) => {
															nodestore.updateBusinessHourTimes(
																index,
																(
																	value ?? []
																).map(
																	(time) => {
																		return time?.toString();
																	}
																)
															);
														}}
													/>
												</Flex>
											);
										}
									)}
								</Flex>
								<Divider />
								<Flex align="flex-start" vertical>
									<TypographyText>Timezone</TypographyText>
									<Select
										style={{
											width: '200px',
										}}
										value={nodestore.businessHourTimezone}
										onChange={(value) => {
											const timezone = Defined.parse(
												value
											)
												.orThrow(
													'value for timezone is not defined'
												)
												.toString();

											nodestore.updateTimezone(timezone);
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
													<SelectOption value={name}>
														(GMT{timezone}) {name}
													</SelectOption>
												);
											})}
									</Select>
								</Flex>
							</Flex>
						</Col>
					</Row>
				</Flex>
			);
		};
	},
});

export default Home;

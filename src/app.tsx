import { computed, defineComponent, markRaw, ref } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { VueFlow, useVueFlow, type Elements } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

import { Defined, capitalize } from '@poolofdeath20/util';

import nodes from './data/nodes';
import { TextInput } from './components/input';
import { generatePositions } from './logic/util';
import { ConversationTrigger } from './components/trigger';
import { SendMessage } from './components/send-message';
import { DateTime } from './components/date-time';
import { DateTimeConnector } from './components/date-time-connector';
import { AddComment } from './components/add-comment';

const App = defineComponent({
	name: 'App',
	setup() {
		const elements = ref(
			nodes.map((node) => {
				return {
					...node,
					type: `${node.type}-${node.id}`,
				};
			})
		);

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

		const nodeTypes = elements.value
			.map((element) => {
				const Component = Defined.parse(
					charts.find((chart) => {
						return element.type.startsWith(`${chart.type}-`);
					})
				)
					.map((chart) => {
						const name = getElementName(element);

						switch (chart.type) {
							case 'trigger': {
								return (
									<chart.Component value="Conversation Opened" />
								);
							}
							case 'sendMessage': {
								return (
									<chart.Component
										title={name()}
										value={
											element.data.payload?.at(0)?.text ??
											'hi fix me'
										}
									/>
								);
							}
							case 'dateTime': {
								return (
									<chart.Component
										title={name()}
										value={Defined.parse(
											element.timezone
										).orThrow(
											'timezone for dateTime is not defined'
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
										title={name()}
										value={Defined.parse(
											element.data.comment
										).orThrow(
											'comment for addComment is not defined'
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

		const nodesEdges = computed(() => {
			return ref<Elements>([
				...generatePositions(elements.value).map((node) => {
					return {
						...node,
						label: node.name ?? 'Conversation Opened',
						id: node.id.toString(),
						parentNode: node.parentNode?.toString(),
						style: {
							width: 'fit-content',
						},
					};
				}),
				...elements.value.map((node) => {
					return {
						label: 'hl',
						id: node.parentNode
							? `${node.parentNode}-${node.id}`
							: '',
						source: node.parentNode?.toString() ?? '',
						target: node.id.toString(),
						animated: true,
						style: {
							stroke: 'red',
						},
					};
				}),
			]);
		});

		const { addEdges, onConnect } = useVueFlow();

		onConnect(addEdges);

		return () => {
			return (
				<div
					style={{
						fontFamily: 'monospace',
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
							modelValue={nodesEdges.value.value}
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

export default App;

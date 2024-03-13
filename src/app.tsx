import { defineComponent, ref } from 'vue';

import { VueFlow, useVueFlow, type Elements } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
// import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

import { Defined, Optional, capitalize } from '@poolofdeath20/util';

import nodes from './data/nodes';
import { TextInput } from './components/input';
import { generatePositions } from './logic/util';

const App = defineComponent({
	name: 'App',
	setup() {
		const elements = ref<Elements>([
			...generatePositions().map((node) => {
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
			...nodes.map((node) => {
				return {
					label: 'hl',
					id: node.parentNode ? `${node.parentNode}-${node.id}` : '',
					source: node.parentNode?.toString() ?? '',
					target: node.id.toString(),
					animated: true,
				};
			}),
		]);

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
						<VueFlow modelValue={elements.value}>
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
							{Optional.from(
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
								.unwrapOrElse(() => {
									return <div>No times</div>;
								})}
						</div>
					</div>
				</div>
			);
		};
	},
});

export default App;

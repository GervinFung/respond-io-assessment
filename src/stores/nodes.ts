import { defineStore } from 'pinia';

import { Defined, type Return } from '@poolofdeath20/util';

import nodes from '../data/nodes';

import { type Payload } from '../components/send-message';

import { generateNodesPositions, type Coordinate } from '../logic/util';

const useNodeStore = defineStore('nodes', {
	state: () => {
		return {
			nodes: generateNodesPositions(nodes).map((node) => {
				const { length } = nodes.filter(({ type }) => {
					return type === node.type;
				});

				return {
					...node,
					name: node.name ?? node.type,
					type: length === 1 ? node.type : `${node.type}-${node.id}`,
					id: node.id.toString(),
					parentNode: node.parentNode?.toString(),
				};
			}),
			edges: nodes.map((node) => {
				const source = node.parentNode?.toString() ?? '';
				const target = node.id?.toString() ?? '';

				return {
					id: `${source}-${target}`,
					source,
					target,
					type: `${node.type}-${target}`,
				};
			}),
		};
	},
	getters: {
		businessHour: (state) => {
			return Defined.parse(
				state.nodes.find((node) => {
					return node.type.startsWith('dateTime');
				})
			).orThrow('Business Hours is not defined');
		},
		businessHourTimezone(): string {
			return Defined.parse(this.businessHour.timezone).orThrow(
				'Timezone is not defined'
			);
		},
		businessHourTimes(): ReadonlyArray<{
			startTime: string;
			endTime: string;
			day: string;
		}> {
			return Defined.parse(this.businessHour.data.times).orThrow(
				'Times are not defined'
			);
		},
		comments: (state) => {
			return state.nodes.filter((node) => {
				return node.type.startsWith('addComment');
			});
		},
		trigger: (state) => {
			return Defined.parse(
				state.nodes.find((node) => {
					return node.type.startsWith('trigger');
				})
			).orThrow('Trigger is not defined');
		},
		sendMessages: (state) => {
			return state.nodes.filter((node) => {
				return node.type.startsWith('sendMessage');
			});
		},
	},
	actions: {
		updateTimezone(timezone: string) {
			const index = this.nodes.findIndex((node) => {
				return node.name === 'Business Hours';
			});

			this.nodes[index].timezone = timezone;
		},
		updateBusinessHourTimes(
			index: number,
			[start, end]: ReadonlyArray<string | undefined>
		) {
			const times = this.businessHourTimes;

			times[index].startTime = Defined.parse(start).orThrow(
				'start is not defined'
			);

			times[index].endTime =
				Defined.parse(end).orThrow('end is not defined');
		},
		updateComment(
			props: Readonly<{
				id: string;
				name: string;
				comment: string;
			}>
		) {
			// idk why pinia auto passes an event object when clicking outside
			if (!(props instanceof Event)) {
				const comment = Defined.parse(
					this.comments.find((comment) => {
						return comment.id === props.id;
					})
				).orThrow(`Comment node with id of "${props.id}" not found`);

				comment.data.comment = props.comment;
				comment.name = props.name;
			}
		},
		updateTrigger(
			props: Readonly<{
				title: string;
				value: string;
			}>
		) {
			// idk why pinia auto passes an event object when clicking outside
			if (!(props instanceof Event)) {
				this.trigger.data.type = props.value;
				this.trigger.name = props.title;
			}
		},
		updateSendMessages(
			props: Readonly<{
				id: string;
				name: string;
				payload: Payload;
			}>
		) {
			// idk why pinia auto passes an event object when clicking outside
			if (!(props instanceof Event)) {
				const sendMessage = Defined.parse(
					this.sendMessages.find((message) => {
						return message.id === props.id;
					})
				).orThrow(
					`SendMessage node with id of "${props.id}" not found`
				);

				sendMessage.data.payload = props.payload.slice();
				sendMessage.name = props.name;
			}
		},
		updateNodePosition(
			props: Readonly<{
				id: string;
				position: Coordinate;
			}>
		) {
			this.nodes = this.nodes.map((node) => {
				if (props.id !== node.id) {
					return node;
				}

				return {
					...node,
					position: props.position,
				};
			});
		},
	},
});

type NodeStore = Return<typeof useNodeStore>;

export type { NodeStore };

export default useNodeStore;

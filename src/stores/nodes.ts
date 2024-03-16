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
		findBusinessHourById: (state) => {
			return (id: string) => {
				return Defined.parse(
					state.nodes.find((node) => {
						return (
							node.type.startsWith('dateTime') && node.id === id
						);
					})
				).orThrow('Business Hours is not defined');
			};
		},
		findBusinessHourTimezoneById(): (id: string) => string {
			return (id: string) => {
				return Defined.parse(
					this.findBusinessHourById(id).timezone
				).orThrow('Timezone is not defined');
			};
		},
		findBusinessHourTimesById(): (id: string) => ReadonlyArray<{
			startTime: string;
			endTime: string;
			day: string;
		}> {
			return (id: string) => {
				return Defined.parse(
					this.findBusinessHourById(id).data.times
				).orThrow('Times are not defined');
			};
		},
		findCommentById: (state) => {
			return (id: string) => {
				return Defined.parse(
					state.nodes.find((node) => {
						return (
							node.type.startsWith('addComment') && node.id === id
						);
					})
				).orThrow(`Comment Node with id of "${id}" not found`);
			};
		},
		trigger: (state) => {
			return Defined.parse(
				state.nodes.find((node) => {
					return node.type.startsWith('trigger');
				})
			).orThrow('Trigger is not defined');
		},
		findSendMessageById: (state) => {
			return (id: string) => {
				return Defined.parse(
					state.nodes.find((node) => {
						return (
							node.type.startsWith('sendMessage') &&
							node.id === id
						);
					})
				).orThrow(`Send Message Node with id of "${id}" not found`);
			};
		},
		findNodeById: (state) => {
			return (id: string) => {
				return Defined.parse(
					state.nodes.find((node) => {
						return node.id === id;
					})
				).orThrow(`Node with id of "${id}" not found`);
			};
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
			props: Readonly<{
				id: string;
				index: number;
				times: ReadonlyArray<string | undefined>;
			}>
		) {
			const {
				index,
				times: [start, end],
			} = props;

			const times = this.findBusinessHourTimesById(props.id);

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
				const comment = this.findCommentById(props.id);

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
		updateSendMessage(
			props: Readonly<{
				id: string;
				name: string;
				payload: Payload;
			}>
		) {
			// idk why pinia auto passes an event object when clicking outside
			if (!(props instanceof Event)) {
				const sendMessage = this.findSendMessageById(props.id);

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
			this.findNodeById(props.id).position = props.position;
		},
		deleteNode(
			props: Readonly<{
				id: string;
			}>
		) {
			return () => {
				this.nodes = this.nodes.filter((node) => {
					return node.id !== props.id;
				});
			};
		},
	},
});

type NodeStore = Return<typeof useNodeStore>;

export type { NodeStore };

export default useNodeStore;

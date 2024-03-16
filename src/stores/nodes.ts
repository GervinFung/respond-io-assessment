import { defineStore } from 'pinia';

import { Defined, type Return } from '@poolofdeath20/util';

import nodes from '../data/nodes';

import { type Payload } from '../components/send-message';

import { generateNodesPositions, type Coordinate } from '../logic/util';
import { unref } from 'vue';

type Id = Readonly<{
	id: string;
}>;

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
		findDatetimes: (state) => {
			return state.nodes.filter((node) => {
				return node.type.startsWith('dateTime');
			});
		},
		findDateTimeById() {
			return (id: string) => {
				return Defined.parse(
					this.findDatetimes.find((node) => {
						return node.id === id;
					})
				).orThrow('Datetime is not defined');
			};
		},
		findDatetimeTimezoneById(): (id: string) => string {
			return (id: string) => {
				return Defined.parse(
					this.findDateTimeById(id).timezone
				).orThrow('Timezone is not defined');
			};
		},
		findDateTimeTimesById(): (id: string) => ReadonlyArray<{
			startTime: string;
			endTime: string;
			day: string;
		}> {
			return (id: string) => {
				return Defined.parse(
					this.findDateTimeById(id).data.times
				).orThrow('Times are not defined');
			};
		},
		findComments: (state) => {
			return state.nodes.filter((node) => {
				return node.type.startsWith('addComment');
			});
		},
		findCommentById() {
			return (id: string) => {
				return Defined.parse(
					this.findComments.find((node) => {
						return node.id === id;
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
		findSendMessages: (state) => {
			return state.nodes.filter((node) => {
				return node.type.startsWith('sendMessage');
			});
		},
		findSendMessageById() {
			return (id: string) => {
				return Defined.parse(
					this.findSendMessages.find((node) => {
						return node.id === id;
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

			const times = this.findDateTimeTimesById(props.id);

			times[index].startTime = Defined.parse(start).orThrow(
				'start is not defined'
			);

			times[index].endTime =
				Defined.parse(end).orThrow('end is not defined');
		},
		updateComment(
			props: Id &
				Readonly<{
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
			props: Id &
				Readonly<{
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
			props: Id &
				Readonly<{
					position: Coordinate;
				}>
		) {
			this.findNodeById(props.id).position = props.position;
		},
		deleteNode(props: Id) {
			return () => {
				this.nodes = this.nodes.filter((node) => {
					return node.id !== props.id;
				});
			};
		},
		duplicateDateTime(props: Id) {
			const node = this.findDateTimeById(props.id);

			const { length } = this.findDatetimes;

			// @ts-expect-error: Due to unrelated props required by typescript compiler
			// when only the following is needed
			this.nodes.push({
				name: 'Date time details',
				id: window.crypto.randomUUID(),
				data: {
					times: [
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'mon',
						},
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'tue',
						},
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'wed',
						},
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'thu',
						},
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'fri',
						},
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'sat',
						},
						{
							startTime: '09:00',
							endTime: '17:00',
							day: 'sun',
						},
					],
				},
				type: unref(node.type),
				timezone: 'UTC',
				position: {
					x: node.position.x + length * 20,
					y: node.position.y + length * 20,
				},
			});
		},
		duplicateAddComment(props: Id) {
			const node = this.findCommentById(props.id);

			const { length } = this.findComments;

			// @ts-expect-error: Due to unrelated props required by typescript compiler
			// when only the following is needed
			this.nodes.push({
				name: 'Comment details',
				type: unref(node.type),
				id: window.crypto.randomUUID(),
				data: {
					comment: 'No comment yet',
				},
				position: {
					x: node.position.x + length * 20,
					y: node.position.y + length * 20,
				},
			});
		},
		duplicateSendMessage(props: Id) {
			const node = this.findSendMessageById(props.id);

			const { length } = this.findSendMessages;

			// @ts-expect-error: Due to unrelated props required by typescript compiler
			// when only the following is needed
			this.nodes.push({
				name: 'Message details',
				type: unref(node.type),
				id: window.crypto.randomUUID(),
				data: {
					payload: [],
				},
				position: {
					x: node.position.x + length * 20,
					y: node.position.y + length * 20,
				},
			});
		},
	},
});

type NodeStore = Return<typeof useNodeStore>;

export type { NodeStore };

export default useNodeStore;

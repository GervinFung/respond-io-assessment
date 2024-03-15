import { defineStore } from 'pinia';

import { Defined } from '@poolofdeath20/util';

import nodes from '../data/nodes';

const useNodeStore = defineStore('nodes', {
	state: () => {
		return {
			nodes: nodes.map((node) => {
				const { length } = nodes.filter(({ type }) => {
					return type === node.type;
				});

				return {
					...node,
					name: node.name ?? node.type,
					type: length === 1 ? node.type : `${node.type}-${node.id}`,
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
		comment: (state) => {
			return Defined.parse(
				state.nodes.find((node) => {
					return node.type.startsWith('addComment');
				})
			).orThrow('Comment is not defined');
		},
		trigger: (state) => {
			return Defined.parse(
				state.nodes.find((node) => {
					return node.type.startsWith('trigger');
				})
			).orThrow('Trigger is not defined');
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
				name: string;
				comment: string;
			}>
		) {
			// idk why pinia auto passes an event object when clicking outside
			if (!(props instanceof Event)) {
				this.comment.data.comment = props.comment;
				this.comment.name = props.name;
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
	},
});

export default useNodeStore;

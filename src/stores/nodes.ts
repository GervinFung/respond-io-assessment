import { defineStore } from 'pinia';

import nodes from '../data/nodes';
import { Defined } from '@poolofdeath20/util';

const useNodeStore = defineStore('nodes', {
	state: () => {
		return {
			nodeList: nodes.map((node) => {
				return {
					...node,
					type: `${node.type}-${node.id}`,
				};
			}),
		};
	},
	getters: {
		businessHour(state) {
			return Defined.parse(
				state.nodeList.find((node) => {
					return node.name === 'Business Hours';
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
	},
	actions: {
		updateTimezone(timezone: string) {
			const index = this.nodeList.findIndex((node) => {
				return node.name === 'Business Hours';
			});

			this.nodeList[index].timezone = timezone;
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
	},
});

export default useNodeStore;

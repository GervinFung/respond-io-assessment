import { ref } from 'vue';

import { defineStore } from 'pinia';

import { Defined } from '@poolofdeath20/util';

import nodes from '../data/nodes';

const useNodeStore = defineStore('nodes', () => {
	const nodes = ref(nodes);

	const updateBusinessHours = (index: number, value: string) => {
		const hoursIndex = Defined.parse(
			nodes.value.findIndex((node) => {
				return node.name === 'Business Hours';
			})
		).orThrow('Business Hours node not found');

		// nodes.value[hoursIndex]?.data?.times[index]?.startTime = value;
	};

	return { nodes };
});

export default useNodeStore;

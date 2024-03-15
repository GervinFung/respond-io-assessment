import { ref } from 'vue';

import { defineStore } from 'pinia';

import nodes from '../data/nodes';

const useNodeStore = defineStore('nodes', () => {
	const nodeList = ref(
		nodes.map((node) => {
			return {
				...node,
				type: `${node.type}-${node.id}`,
			};
		})
	);

	return { nodeList };
});

export default useNodeStore;

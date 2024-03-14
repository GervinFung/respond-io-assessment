import { ref } from 'vue';

import { defineStore } from 'pinia';

import nodes from '../data/nodes';
import { generateNodesPositions } from '../logic/util';

const useNodeStore = (
	size: Readonly<{
		width: number;
		height: number;
	}>
) => {
	return defineStore('nodes', () => {
		const nodeList = ref(
			generateNodesPositions(nodes, size).map((node) => {
				return {
					...node,
					type: `${node.type}-${node.id}`,
				};
			})
		);

		return { nodeList };
	});
};

export default useNodeStore;

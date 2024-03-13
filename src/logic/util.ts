import dagre from '@dagrejs/dagre';

import nodes from '../data/nodes';
import { Defined } from '@poolofdeath20/util';

const generatePositions = (): ReadonlyArray<
	(typeof nodes)[0] & { position: { x: number; y: number } }
> => {
	// Create a new directed graph
	const graph = new dagre.graphlib.Graph();

	// Set an object for the graph label
	graph.setGraph({
		rankdir: 'TB',
	});

	// Default to assigning a new object as a label for each new edge.
	graph.setDefaultEdgeLabel(() => {
		return {};
	});

	nodes.forEach((node) => {
		graph.setNode(node.id.toString(), {
			label: node.name,
			width: (node.name?.length ?? 0) * 5,
			height: 25,
		});
	});

	nodes.forEach((node) => {
		if (node.parentNode) {
			graph.setEdge(node.id.toString(), node.parentNode.toString());
		}
	});

	dagre.layout(graph);

	const nodesPosition = graph.nodes().map((node) => {
		const { x, y, label } = graph.node(node);

		return { x, y, label };
	});

	return nodes.map((node) => {
		const { x, y } = Defined.parse(
			nodesPosition.find((position) => {
				return position.label === node.name;
			})
		).orThrow('Position not found');

		return {
			...node,
			position: {
				x,
				y,
			},
		};
	});
};

export { generatePositions };
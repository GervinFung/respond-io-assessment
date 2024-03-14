import dagre from '@dagrejs/dagre';

import type nodes from '../data/nodes';
import { Defined } from '@poolofdeath20/util';

type Position = Readonly<{ x: number; y: number }>;

const generateNodesPositions = (
	nodeList: typeof nodes,
	size: Readonly<{
		width: number;
		height: number;
	}>
): ReadonlyArray<
	(typeof nodes)[0] & { position: Position; computedPosition: Position }
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

	nodeList.forEach((node) => {
		graph.setNode(node.id.toString(), {
			label: node.id.toString(),
			width: size.width / 1.5,
			height: size.height,
		});
	});

	nodeList.forEach((node) => {
		if (node.parentNode) {
			graph.setEdge(node.parentNode.toString(), node.id.toString());
		}
	});

	dagre.layout(graph);

	const nodesPosition = graph.nodes().map((node) => {
		const { x, y, label } = graph.node(node);

		return {
			label,
			x: x - size.width / 2,
			y: y - size.height / 2,
		};
	});

	return nodeList.map((node) => {
		return Defined.parse(
			nodesPosition.find((position) => {
				return position.label === node.id.toString();
			})
		)
			.map(({ x, y }) => {
				const position = {
					x,
					y,
				};

				return {
					...node,
					position,
					computedPosition: position,
				};
			})
			.orThrow('Position not found');
	});
};

export { generateNodesPositions };

import dagre from '@dagrejs/dagre';

import { Position } from '@vue-flow/core';

import { Defined } from '@poolofdeath20/util';

import type nodelist from '../data/nodes';

import { size } from '../const';

type Coordinate = Readonly<{ x: number; y: number }>;

const generateNodesPositions = <Nodes extends typeof nodelist>(
	nodes: Nodes
): ReadonlyArray<
	Nodes[0] & {
		position: Coordinate;
	}
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
			label: node.id.toString(),
			width: size.width,
			height: size.height,
		});
	});

	nodes.forEach((node) => {
		if (node.parentNode) {
			graph.setEdge(node.parentNode.toString(), node.id.toString());
		}
	});

	dagre.layout(graph);

	const nodesPosition = graph.nodes().map((node) => {
		const { x, y, label } = graph.node(node);

		return {
			label,
			x,
			y,
		};
	});

	return nodes.map((node) => {
		return Defined.parse(
			nodesPosition.find((position) => {
				return position.label === node.id.toString();
			})
		)
			.map(({ x, y }) => {
				return {
					...node,
					position: {
						x,
						y,
					},
					sourcePosition: Position.Top,
					targetPosition: Position.Bottom,
				};
			})
			.orThrow('Position not found');
	});
};

export type { Coordinate };

export { generateNodesPositions };

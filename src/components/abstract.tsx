import {
	defineComponent,
	type Events,
	type PropType,
	type SetupContext,
	type SlotsType,
} from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { Handle, Position } from '@vue-flow/core';

import { RouterLink } from 'vue-router';

import { Flex, TypographyTitle } from 'ant-design-vue';

import { FolderPlusIcon } from '@heroicons/vue/24/outline';

import { equalTo, type Optional } from '@poolofdeath20/util';

import type { NodeStore } from '../stores/nodes';

type NullableId = Optional<string>;

const isCurrentId = (id: string, anotherId: NullableId) => {
	return anotherId.map(equalTo(id)).unwrapOrGet(false);
};

type Slots = Readonly<{
	default?: () => JSX.Element;
}>;

const childProps = {
	value: {
		type: String,
		required: true,
	},
	paramId: {
		type: Object as PropType<NullableId>,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
	onDelete: {
		type: Function as PropType<NodeStore['deleteNode']>,
		required: true,
	},
} as const;

const props = {
	id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	size: {
		type: Object as PropType<{
			width: number;
			height: number;
		}>,
		required: true,
	},
	icon: {
		type: Object as PropType<JSX.Element>,
		required: true,
	},
	onDuplicate: {
		type: Function as PropType<NodeStore['duplicateAddComment']>,
		required: true,
	},
} as const;

const AbstractNode = defineComponent({
	props,
	name: 'abstract-node',
	setup(props, context: SetupContext<Events, SlotsType<Slots>>) {
		return () => {
			const style = {
				padding: 12,
				borderColor: '#C1C1C1',
			};

			return (
				<>
					<Handle type="target" position={Position.Top} />
					<Handle type="source" position={Position.Bottom} />
					<RouterLink
						to={`/node/${props.id}`}
						style={{
							textDecoration: 'none',
						}}
					>
						<Flex
							vertical
							style={{
								color: '#121212',
								borderRadius: '8px',
								border: `1px solid ${style.borderColor}`,
								minHeight: `${props.size.height}px`,
								width: `${props.size.width}px`,
								backgroundColor: '#FEFEFE',
								cursor: 'pointer',
							}}
						>
							<Flex
								gap={8}
								align="center"
								justify="space-between"
								style={{
									padding: `${style.padding}px`,
									borderBottom: `1px solid ${style.borderColor}`,
								}}
							>
								<Flex gap={4}>
									{props.icon}
									<TypographyTitle
										level={5}
										// @ts-expect-error: Style doesn't exists for `TypographyTitle`, but injectable in runtime
										style={{
											margin: 0,
										}}
									>
										{props.title}
									</TypographyTitle>
								</Flex>
								<FolderPlusIcon
									style={{
										width: '24px',
										color: '#121212',
									}}
									onClick={(event) => {
										event.preventDefault();

										props.onDuplicate(props);
									}}
								/>
							</Flex>
							<div
								style={{
									padding: `${style.padding}px`,
								}}
							>
								{context.slots.default?.()}
							</div>
						</Flex>
					</RouterLink>
				</>
			);
		};
	},
});

export { props, childProps, isCurrentId };
export { AbstractNode };

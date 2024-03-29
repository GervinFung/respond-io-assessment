import { defineComponent, type PropType } from 'vue';

import { Divider, Drawer, Flex, TypographyText } from 'ant-design-vue';

import { BoltIcon } from '@heroicons/vue/24/outline';

import { capitalize } from '@poolofdeath20/util';

import { AbstractNode, props, childProps, isCurrentId } from './abstract';
import { TextField } from './input';
import type { NodeStore } from '../stores/nodes';
import { useDrawer } from '../logic/drawer';
import { DeleteNode } from './delete-node';

const Component = defineComponent({
	props: {
		id: props.id,
		title: props.title,
		value: childProps.value,
		color: childProps.color,
		size: props.size,
		onChange: {
			type: Function as PropType<
				(
					props: Readonly<{
						title: string;
						value: string;
					}>
				) => void
			>,
			required: true,
		},
	},
	setup(props) {
		return () => {
			return (
				<AbstractNode
					{...props}
					title={capitalize(props.title)}
					icon={
						<BoltIcon
							style={{
								width: '24px',
								color: props.color,
							}}
						/>
					}
				>
					<TypographyText>{props.value}</TypographyText>
				</AbstractNode>
			);
		};
	},
});

const TriggerDrawer = defineComponent({
	props: {
		id: props.id,
		paramId: childProps.paramId,
		title: props.title,
		value: childProps.value,
		onChange: {
			type: Function as PropType<NodeStore['updateTrigger']>,
			required: true,
		},
		onDelete: childProps.onDelete,
	},
	setup(props) {
		const drawer = useDrawer(() => {
			return isCurrentId(props.id, props.paramId);
		});

		return () => {
			return (
				<Drawer
					title="Trigger Details"
					open={drawer.open.value}
					onClose={drawer.onClose}
				>
					<Flex
						gap={8}
						vertical
						style={{
							padding: '8px',
						}}
					>
						<Flex vertical gap={16}>
							<TextField
								title="Title"
								placeholder="Add a title"
								value={props.title}
								onChange={(title) => {
									props.onChange({
										title,
										value: props.value,
									});
								}}
							/>
							<TextField
								title="Value"
								placeholder="Add a value"
								value={props.value}
								onChange={(value) => {
									props.onChange({
										title: props.title,
										value,
									});
								}}
							/>
						</Flex>
						<Divider />
						<DeleteNode onClick={props.onDelete(props)} />
					</Flex>
				</Drawer>
			);
		};
	},
});

const ConversationTrigger = () => {
	return {
		type: 'trigger',
		Component,
		Drawer: TriggerDrawer,
	} as const;
};

export { ConversationTrigger };

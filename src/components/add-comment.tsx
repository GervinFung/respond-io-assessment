import { defineComponent, type PropType } from 'vue';

import { Drawer, Flex, TypographyText } from 'ant-design-vue';

import { ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props, childProps, isCurrentId } from './abstract';
import { TextField } from './input';
import type { NodeStore } from '../stores/nodes';
import { useDrawer } from '../logic/drawer';

const Component = defineComponent({
	props: {
		id: props.id,
		title: props.title,
		value: childProps.value,
		color: childProps.color,
		size: props.size,
	},
	setup(props) {
		return () => {
			return (
				<AbstractNode
					{...props}
					icon={
						<ChatBubbleBottomCenterIcon
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

const AddCommentDrawer = defineComponent({
	props: {
		id: props.id,
		paramId: childProps.paramId,
		title: props.title,
		value: childProps.value,
		onChange: {
			type: Function as PropType<NodeStore['updateComment']>,
			required: true,
		},
	},
	setup(props) {
		const drawer = useDrawer(() => {
			return isCurrentId(props.id, props.paramId);
		});

		return () => {
			return (
				<Drawer
					title="Add Comment Details"
					open={drawer.open.value}
					onClose={drawer.onClose}
				>
					<Flex vertical gap={8}>
						<TextField
							title="Title"
							placeholder="Add a title"
							value={props.title}
							onChange={(name) => {
								props.onChange({
									id: props.id,
									name,
									comment: props.value,
								});
							}}
						/>
						<TextField
							title="Comment"
							placeholder="Add a comment"
							value={props.value}
							onChange={(comment) => {
								props.onChange({
									id: props.id,
									name: props.title,
									comment,
								});
							}}
						/>
					</Flex>
				</Drawer>
			);
		};
	},
});

const AddComment = () => {
	return {
		type: 'addComment',
		Component,
		Drawer: AddCommentDrawer,
	} as const;
};

export { AddComment };

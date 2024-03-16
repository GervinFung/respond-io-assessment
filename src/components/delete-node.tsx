import { defineComponent, type PropType } from 'vue';

import { Button, Flex, Popconfirm, TypographyText } from 'ant-design-vue';

const DeleteNode = defineComponent({
	name: 'delete-node',
	props: {
		onClick: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	setup(props) {
		return () => {
			return (
				<Flex align="flex-start" vertical gap={4}>
					<TypographyText type="danger">Danger Zone</TypographyText>
					<Popconfirm
						title="Are you sure to delete this node"
						onConfirm={props.onClick}
					>
						<Button danger>Delete this node</Button>
					</Popconfirm>
				</Flex>
			);
		};
	},
});

export { DeleteNode };

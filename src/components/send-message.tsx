import { defineComponent } from 'vue';

import { Flex, TypographyText } from 'ant-design-vue';

import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, childProps, props } from './abstract';

const SendMessage = () => {
	return {
		type: 'sendMessage',
		Component: defineComponent({
			props: {
				id: props.id,
				title: props.title,
				value: childProps.value,
				size: props.size,
				param: props.param,
			},
			setup(props) {
				return () => {
					return (
						<AbstractNode
							{...props}
							icon={
								<ChatBubbleLeftIcon
									style={{
										width: '24px',
									}}
								/>
							}
						>
							<Flex vertical>
								<TypographyText>Message:</TypographyText>
								<TypographyText mark>
									{props.value}
								</TypographyText>
							</Flex>
						</AbstractNode>
					);
				};
			},
		}),
	} as const;
};

export { SendMessage };

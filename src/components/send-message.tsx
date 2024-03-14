import { defineComponent } from 'vue';

import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props } from './abstract';

const SendMessage = () => {
	return {
		type: 'sendMessage',
		Component: defineComponent({
			props: {
				id: props.id,
				title: props.title,
				value: props.value,
				size: props.size,
				param: props.param,
			},
			setup(props) {
				return () => {
					return (
						<AbstractNode
							shouldItalic
							{...props}
							icon={
								<ChatBubbleLeftIcon
									style={{
										width: '24px',
									}}
								/>
							}
						/>
					);
				};
			},
		}),
	} as const;
};

export { SendMessage };

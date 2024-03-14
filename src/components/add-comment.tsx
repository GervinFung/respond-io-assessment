import { defineComponent } from 'vue';

import { ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props } from './abstract';

const AddComment = () => {
	return {
		type: 'addComment',
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
							{...props}
							icon={
								<ChatBubbleBottomCenterIcon
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

export { AddComment };

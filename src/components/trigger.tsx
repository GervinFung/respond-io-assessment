import { defineComponent } from 'vue';

import { BoltIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props } from './abstract';

const ConversationTrigger = () => {
	return {
		type: 'trigger',
		Component: defineComponent({
			props: {
				id: props.id,
				value: props.value,
				size: props.size,
				param: props.param,
			},
			setup(props) {
				return () => {
					return (
						<AbstractNode
							title="Trigger"
							{...props}
							icon={
								<BoltIcon
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

export { ConversationTrigger };

import { defineComponent } from 'vue';

import { AbstractNode } from './abstract';

const ConversationTrigger = () => {
	return {
		type: 'trigger',
		Component: defineComponent({
			props: {
				value: {
					type: String,
					required: true,
				},
			},
			setup(props) {
				return () => {
					return <AbstractNode title="Trigger" value={props.value} />;
				};
			},
		}),
	} as const;
};

export { ConversationTrigger };

import { defineComponent } from 'vue';

import { TypographyText } from 'ant-design-vue';

import { BoltIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props, childProps } from './abstract';

const ConversationTrigger = () => {
	return {
		type: 'trigger',
		Component: defineComponent({
			props: {
				id: props.id,
				value: childProps.value,
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
						>
							<TypographyText>{props.value}</TypographyText>
						</AbstractNode>
					);
				};
			},
		}),
	} as const;
};

export { ConversationTrigger };

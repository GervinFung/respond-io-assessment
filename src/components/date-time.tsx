import { defineComponent } from 'vue';

import { TypographyText } from 'ant-design-vue';

import { CalendarIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props, childProps } from './abstract';

const DateTime = () => {
	return {
		type: 'dateTime',
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
								<CalendarIcon
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

export { DateTime };

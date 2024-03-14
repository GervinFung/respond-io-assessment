import { defineComponent } from 'vue';

import { CalendarIcon } from '@heroicons/vue/24/outline';

import { AbstractNode, props } from './abstract';

const DateTime = () => {
	return {
		type: 'dateTime',
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
								<CalendarIcon
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

export { DateTime };

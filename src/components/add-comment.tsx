import { defineComponent } from 'vue';

import { AbstractNode } from './abstract';

const AddComment = () => {
	return {
		type: 'addComment',
		Component: defineComponent({
			props: {
				title: {
					type: String,
					required: true,
				},
				value: {
					type: String,
					required: true,
				},
			},
			setup(props) {
				return () => {
					return (
						<AbstractNode title={props.title} value={props.value} />
					);
				};
			},
		}),
	} as const;
};

export { AddComment };

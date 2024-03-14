import { defineComponent, type PropType } from 'vue';
import { RouterLink } from 'vue-router';

import type { JSX } from 'vue/jsx-runtime';

const props = {
	id: {
		type: String,
		required: true,
	},
	param: {
		type: Object as PropType<
			| undefined
			| Readonly<{
					id: string;
			  }>
		>,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	value: {
		type: String,
		required: true,
	},
	shouldItalic: {
		type: Boolean,
		required: false,
	},
	size: {
		type: Object as PropType<
			Readonly<{
				width: number;
				height: number;
			}>
		>,
		required: true,
	},
	icon: {
		type: Object as PropType<JSX.Element>,
		required: true,
	},
} as const;

const AbstractNode = defineComponent({
	props,
	name: 'AbstractNode',
	setup(props) {
		return () => {
			const style = {
				padding: 12,
				borderColor: '#C1C1C1',
			};

			return (
				<RouterLink
					to={`/node/${props.id}`}
					style={{
						textDecoration: 'none',
					}}
				>
					<div
						style={{
							color: '#121212',
							borderRadius: '8px',
							border: `1px solid ${style.borderColor}`,
							minHeight: `${props.size.height}px`,
							width: `${props.size.width}px`,
							backgroundColor: '#FEFEFE',
							cursor: 'pointer',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								padding: `${style.padding}px`,
								borderBottom: `1px solid ${style.borderColor}`,
								gap: '8px',
							}}
						>
							{props.icon}
							<div
								style={{
									fontWeight: 'bold',
								}}
							>
								{props.title}
							</div>
						</div>
						<div
							style={{
								padding: `${style.padding}px`,
							}}
						>
							<div
								style={{
									marginBottom: '8px',
								}}
							>
								Message:
							</div>
							<div
								style={{
									fontStyle: props.shouldItalic
										? 'italic'
										: undefined,
								}}
							>
								{props.value}
							</div>
						</div>
					</div>
				</RouterLink>
			);
		};
	},
});

export { AbstractNode, props };

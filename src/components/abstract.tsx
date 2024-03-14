import { defineComponent } from 'vue';

const AbstractNode = defineComponent({
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
				<div
					style={{
						borderRadius: '8px',
						border: '1px solid grey',
						width: '150px',
					}}
				>
					<div
						style={{
							padding: '8px',
							borderBottom: '1px solid grey',
						}}
					>
						{props.title}
					</div>
					<div
						style={{
							padding: '16px 8px',
						}}
					>
						{props.value}
					</div>
				</div>
			);
		};
	},
});

export { AbstractNode };

import { defineComponent, type PropType } from 'vue';

const TextInput = defineComponent({
	name: 'TextInput',
	props: {
		value: {
			type: String,
			required: true,
		},
		onChange: Function as PropType<(value: string) => void>,
	},
	setup(props) {
		return () => {
			return (
				<input
					type="text"
					value={props.value}
					style={{
						width: '50px',
						padding: '8px 16px',
					}}
				/>
			);
		};
	},
});

export { TextInput };

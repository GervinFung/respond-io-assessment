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
						borderRadius: '8px',
						width: '50px',
						padding: '8px 12px',
						border: '1px solid #C1C1C1',
						fontSize: '1em',
						textAlign: 'center',
					}}
				/>
			);
		};
	},
});

export { TextInput };

import { defineComponent, type PropType } from 'vue';

import { Input } from 'ant-design-vue';
import { Defined } from '@poolofdeath20/util';

const TextInput = defineComponent({
	name: 'TextInput',
	props: {
		placeholder: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true,
		},
		onChange: {
			type: Function as PropType<(value: string) => void>,
			required: true,
		},
	},
	setup(props) {
		return () => {
			return (
				<Input
					placeholder={props.placeholder}
					value={props.value}
					onChange={(event) => {
						const value = Defined.parse(event.target)
							.map((target) => {
								return Defined.parse(target.value);
							})
							.orThrow('target of event input is undefined')
							.orThrow(
								'value of target of event input is undefined'
							);

						props.onChange(value);
					}}
				/>
			);
		};
	},
});

export { TextInput };

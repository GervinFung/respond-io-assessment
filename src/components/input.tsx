import { defineComponent, type PropType } from 'vue';

import { Flex, Input, TypographyText } from 'ant-design-vue';

import { Defined } from '@poolofdeath20/util';

const textInputProps = {
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
} as const;

const TextInput = defineComponent({
	name: 'text-input',
	props: textInputProps,
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

const TextField = defineComponent({
	name: 'text-field',
	props: {
		...textInputProps,
		title: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		return () => {
			return (
				<Flex vertical>
					<TypographyText>{props.title}</TypographyText>
					<TextInput {...props} />
				</Flex>
			);
		};
	},
});

export { TextInput, TextField };

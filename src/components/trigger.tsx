import { computed, defineComponent, type PropType } from 'vue';

import { Flex, TypographyText } from 'ant-design-vue';

import { BoltIcon } from '@heroicons/vue/24/outline';

import { capitalize } from '@poolofdeath20/util';

import { AbstractNode, props, childProps, isCurrentId } from './abstract';
import { TextInput } from './input';

const ConversationTrigger = () => {
	return {
		type: 'trigger',
		Component: defineComponent({
			props: {
				id: props.id,
				title: props.title,
				value: childProps.value,
				size: props.size,
				param: props.param,
				onChange: {
					type: Function as PropType<
						(
							props: Readonly<{
								title: string;
								value: string;
							}>
						) => void
					>,
					required: true,
				},
			},
			setup(props) {
				const isCurrent = computed(() => {
					return isCurrentId(props.id, props.param);
				});

				const Slot = () => {
					switch (isCurrent.value) {
						case false: {
							return (
								<TypographyText>{props.value}</TypographyText>
							);
						}
						case true: {
							return (
								<Flex vertical>
									<TypographyText>Title</TypographyText>
									<TextInput
										placeholder="Add a title"
										value={props.title}
										onChange={(title) => {
											props.onChange({
												title,
												value: props.value,
											});
										}}
									/>
									<TypographyText>Value</TypographyText>
									<TextInput
										placeholder="Add a value (temp)"
										value={props.value}
										onChange={(value) => {
											props.onChange({
												title: props.title,
												value,
											});
										}}
									/>
								</Flex>
							);
						}
					}
				};

				return () => {
					return (
						<AbstractNode
							{...props}
							title={capitalize(props.title)}
							icon={
								<BoltIcon
									style={{
										width: '24px',
									}}
								/>
							}
						>
							<Slot />
						</AbstractNode>
					);
				};
			},
		}),
	} as const;
};

export { ConversationTrigger };

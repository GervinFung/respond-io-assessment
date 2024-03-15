import { computed, defineComponent, type PropType } from 'vue';

import { Flex, Input, TypographyText } from 'ant-design-vue';

import { ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline';

import { Defined } from '@poolofdeath20/util';

import { AbstractNode, props, childProps, isCurrentId } from './abstract';

const AddComment = () => {
	return {
		type: 'addComment',
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
								name: string;
								comment: string;
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
									<Input
										placeholder="Add a title"
										value={props.title}
										onChange={(event) => {
											const name = Defined.parse(
												event.target
											)
												.map((target) => {
													return Defined.parse(
														target.value
													);
												})
												.orThrow(
													'target of event title input is undefined'
												)
												.orThrow(
													'value of target of event title input is undefined'
												);

											props.onChange({
												name,
												comment: props.value,
											});
										}}
									/>
									<TypographyText>Comment</TypographyText>
									<Input
										placeholder="Add a comment"
										value={props.value}
										onChange={(event) => {
											const comment = Defined.parse(
												event.target
											)
												.map((target) => {
													return Defined.parse(
														target.value
													);
												})
												.orThrow(
													'target of event comment input is undefined'
												)
												.orThrow(
													'value of target of event comment input is undefined'
												);

											props.onChange({
												name: props.title,
												comment,
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
							icon={
								<ChatBubbleBottomCenterIcon
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

export { AddComment };

import { computed, defineComponent, ref, type PropType } from 'vue';

import { Flex, TypographyText, Image, Button, Upload } from 'ant-design-vue';

import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline';

import { Defined, Optional } from '@poolofdeath20/util';

import { AbstractNode, isCurrentId, props } from './abstract';
import { TextField, TextInput } from './input';

type Payload = ReadonlyArray<
	| {
			type: 'text';
			text: string;
	  }
	| {
			type: 'attachment';
			attachment: string;
	  }
>;

const SendMessage = () => {
	return {
		type: 'sendMessage',
		Component: defineComponent({
			props: {
				id: props.id,
				title: props.title,
				size: props.size,
				param: props.param,
				payload: {
					type: Array as PropType<Payload>,
					required: true,
				},
				onChange: {
					type: Function as PropType<
						(
							props: Readonly<{
								name: string;
								payload: Payload;
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

				const uploadImage = ref(Optional.none<string>());

				const Slot = () => {
					switch (isCurrent.value) {
						case false: {
							return Defined.parse(props.payload.at(0))
								.map((payload) => {
									switch (payload.type) {
										case 'text': {
											return (
												<>
													<TypographyText>
														Message:
													</TypographyText>
													<TypographyText mark>
														{payload.text}
													</TypographyText>
												</>
											);
										}
										case 'attachment': {
											return (
												<Image
													src={payload.attachment}
													alt="attachment"
												/>
											);
										}
									}
								})
								.orThrow('first payload is undefined');
						}
						case true: {
							return (
								<Flex vertical gap={8}>
									<TextField
										title="Title"
										placeholder="Add a title"
										value={props.title}
										onChange={(name) => {
											props.onChange({
												name,
												payload: props.payload,
											});
										}}
									/>
									<Flex vertical>
										<TypographyText>
											Payloads
										</TypographyText>
										<Flex vertical gap={4}>
											{props.payload.map(
												(payload, index, self) => {
													switch (payload.type) {
														case 'attachment': {
															return (
																<Flex
																	vertical
																	gap={2}
																>
																	<TypographyText>
																		Attachment
																	</TypographyText>
																	<Image
																		src={uploadImage.value.match(
																			{
																				none: () => {
																					return payload.attachment;
																				},
																				some: (
																					attachment
																				) => {
																					return attachment;
																				},
																			}
																		)}
																		alt="attachment"
																	/>
																	<Flex
																		justify="space-between"
																		style={{
																			width: '100%',
																			marginTop:
																				'16px',
																		}}
																	>
																		<Upload
																			beforeUpload={() => {
																				return false;
																			}}
																			onChange={(
																				event
																			) => {
																				if (
																					event.file instanceof
																					File
																				) {
																					uploadImage.value =
																						Optional.some(
																							URL.createObjectURL(
																								event.file
																							)
																						);
																				}
																			}}
																			action={
																				undefined
																			}
																		>
																			<Button type="primary">
																				Upload
																			</Button>
																		</Upload>
																		<Button
																			type="default"
																			disabled={uploadImage.value.isNone()}
																			onClick={() => {
																				uploadImage.value.ifSome(
																					(
																						attachment
																					) => {
																						props.onChange(
																							{
																								name: props.title,
																								payload:
																									self.map(
																										(
																											payload,
																											position
																										) => {
																											if (
																												position ===
																												index
																											) {
																												return {
																													type: 'attachment',
																													attachment,
																												};
																											}

																											return payload;
																										}
																									),
																							}
																						);
																					}
																				);
																			}}
																		>
																			Save
																		</Button>
																	</Flex>
																</Flex>
															);
														}
														case 'text': {
															return (
																<TextInput
																	placeholder="Add a message"
																	value={
																		payload.text
																	}
																	onChange={(
																		comment
																	) => {
																		props.onChange(
																			{
																				name: props.title,
																				payload:
																					self.map(
																						(
																							payload,
																							position
																						) => {
																							if (
																								position ===
																								index
																							) {
																								return {
																									type: 'text',
																									text: comment,
																								};
																							}

																							return payload;
																						}
																					),
																			}
																		);
																	}}
																/>
															);
														}
													}
												}
											)}
										</Flex>
									</Flex>
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
								<ChatBubbleLeftIcon
									style={{
										width: '24px',
									}}
								/>
							}
						>
							<Flex vertical>
								<Slot />
							</Flex>
						</AbstractNode>
					);
				};
			},
		}),
	} as const;
};

export { SendMessage };

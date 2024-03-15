import { defineComponent, ref, type PropType } from 'vue';

import {
	Flex,
	TypographyText,
	Image,
	Button,
	Upload,
	Drawer,
} from 'ant-design-vue';

import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline';

import { Defined, Optional } from '@poolofdeath20/util';

import { AbstractNode, childProps, isCurrentId, props } from './abstract';
import { TextField, TextInput } from './input';
import type { NodeStore } from '../stores/nodes';
import { useDrawer } from '../logic/drawer';

type Payload = Array<
	| {
			type: 'text';
			text: string;
	  }
	| {
			type: 'attachment';
			attachment: string;
	  }
>;

const toBase64 = (file: File) => {
	return new Promise<string | undefined>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			return resolve(reader.result?.toString());
		};

		reader.onerror = reject;
	});
};

const Component = defineComponent({
	props: {
		id: props.id,
		title: props.title,
		size: props.size,
		color: childProps.color,
		payload: {
			type: Array as PropType<Payload>,
			required: true,
		},
		onChange: {
			type: Function as PropType<
				(
					props: Readonly<{
						id: string;
						name: string;
						payload: Payload;
					}>
				) => void
			>,
			required: true,
		},
	},
	setup(props) {
		return () => {
			return (
				<AbstractNode
					{...props}
					icon={
						<ChatBubbleLeftIcon
							style={{
								width: '24px',
								color: props.color,
							}}
						/>
					}
				>
					<Flex vertical>
						{Defined.parse(props.payload.at(0))
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
							.orThrow('first payload is undefined')}
					</Flex>
				</AbstractNode>
			);
		};
	},
});

const SendMessageDrawer = defineComponent({
	props: {
		id: props.id,
		paramId: childProps.paramId,
		title: props.title,
		payload: {
			type: Array as PropType<Payload>,
			required: true,
		},
		onChange: {
			type: Function as PropType<NodeStore['updateSendMessages']>,
			required: true,
		},
	},
	setup(props) {
		const drawer = useDrawer(() => {
			return isCurrentId(props.id, props.paramId);
		});

		const uploadImage = ref(Optional.none<string>());

		const Payloads = props.payload.map((payload, index, self) => {
			switch (payload.type) {
				case 'attachment': {
					return (
						<Flex vertical gap={2}>
							<TypographyText>Attachment</TypographyText>
							<Image
								src={uploadImage.value.match({
									none: () => {
										return payload.attachment;
									},
									some: (attachment) => {
										return attachment;
									},
								})}
								alt="attachment"
							/>
							<Flex
								justify="space-between"
								style={{
									width: '100%',
									marginTop: '16px',
								}}
							>
								<Upload
									beforeUpload={() => {
										return false;
									}}
									onChange={async (event) => {
										if (event.file instanceof File) {
											uploadImage.value = Optional.from(
												await toBase64(event.file)
											);
										}
									}}
								>
									<Button type="primary">Upload</Button>
								</Upload>
								<Button
									type="default"
									disabled={uploadImage.value.isNone()}
									onClick={() => {
										uploadImage.value.ifSome(
											(attachment) => {
												props.onChange({
													id: props.id,
													name: props.title,
													payload: self.map(
														(payload, position) => {
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
												});

												uploadImage.value =
													Optional.none();
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
							value={payload.text}
							onChange={(comment) => {
								props.onChange({
									id: props.id,
									name: props.title,
									payload: self.map((payload, position) => {
										if (position === index) {
											return {
												type: 'text',
												text: comment,
											};
										}

										return payload;
									}),
								});
							}}
						/>
					);
				}
			}
		});

		return () => {
			return (
				<Drawer
					title="Send Message Details"
					open={drawer.open.value}
					onClose={drawer.onClose}
				>
					<Flex vertical gap={8}>
						<TextField
							title="Title"
							placeholder="Add a title"
							value={props.title}
							onChange={(name) => {
								props.onChange({
									id: props.id,
									name,
									payload: props.payload,
								});
							}}
						/>
						<Flex vertical>
							<TypographyText>Payloads</TypographyText>
							<Flex vertical gap={4}>
								{Payloads}
							</Flex>
						</Flex>
					</Flex>
				</Drawer>
			);
		};
	},
});

const SendMessage = () => {
	return {
		type: 'sendMessage',
		Component,
		Drawer: SendMessageDrawer,
	} as const;
};

export type { Payload };

export { SendMessage };

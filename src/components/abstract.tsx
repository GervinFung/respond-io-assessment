import {
	defineComponent,
	type Events,
	type PropType,
	type SetupContext,
	type SlotsType,
} from 'vue';
import type { JSX } from 'vue/jsx-runtime';

import { RouterLink } from 'vue-router';

import { Flex, TypographyTitle } from 'ant-design-vue';

import type { DeepReadonly } from '@poolofdeath20/util';

type Slots = Readonly<{
	default?: () => JSX.Element;
}>;

type Props = DeepReadonly<{
	id: string;
	param:
		| undefined
		| {
				id: string;
		  };
	title: string;
	size: {
		width: number;
		height: number;
	};
	icon: JSX.Element;
}>;

const childProps = {
	value: {
		type: String,
		required: true,
	},
} as const;

const props = {
	id: {
		type: String,
		required: true,
	},
	param: {
		type: Object as PropType<Props['param']>,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	size: {
		type: Object as PropType<Props['size']>,
		required: true,
	},
	icon: {
		type: Object as PropType<Props['icon']>,
		required: true,
	},
} as const;

const AbstractNode = defineComponent({
	props,
	name: 'abstract-node',
	setup(props: Props, context: SetupContext<Events, SlotsType<Slots>>) {
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
					<Flex
						vertical
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
						<Flex
							gap={8}
							align="center"
							style={{
								padding: `${style.padding}px`,
								borderBottom: `1px solid ${style.borderColor}`,
							}}
						>
							{props.icon}
							<Flex>
								<TypographyTitle
									level={5}
									// @ts-expect-error: Style doesn't exists for `TypographyTitle`, but injectable in runtime
									style={{
										margin: 0,
									}}
								>
									{props.title}
								</TypographyTitle>
							</Flex>
						</Flex>
						<div
							style={{
								padding: `${style.padding}px`,
							}}
						>
							{context.slots.default?.()}
						</div>
					</Flex>
				</RouterLink>
			);
		};
	},
});

export { props, childProps };
export { AbstractNode };

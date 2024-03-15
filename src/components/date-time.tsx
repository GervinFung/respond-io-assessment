import { defineComponent, type PropType } from 'vue';

import {
	Divider,
	Drawer,
	Flex,
	Select,
	SelectOption,
	TimeRangePicker,
	TypographyText,
} from 'ant-design-vue';

import { CalendarIcon } from '@heroicons/vue/24/outline';

import { Defined, capitalize } from '@poolofdeath20/util';

import moment from 'moment';
import 'moment-timezone';

import { AbstractNode, props, childProps, isCurrentId } from './abstract';
import type { NodeStore } from '../stores/nodes';
import { useDrawer } from '../logic/drawer';

const Component = defineComponent({
	props: {
		id: props.id,
		title: props.title,
		value: childProps.value,
		size: props.size,
	},
	setup(props) {
		return () => {
			return (
				<AbstractNode
					{...props}
					icon={
						<CalendarIcon
							style={{
								width: '24px',
							}}
						/>
					}
				>
					<TypographyText>{props.value}</TypographyText>
				</AbstractNode>
			);
		};
	},
});

const DateTimeDrawer = defineComponent({
	props: {
		id: props.id,
		paramId: childProps.paramId,
		businessHourTimes: {
			type: Array as PropType<NodeStore['businessHourTimes']>,
			required: true,
		},
		businessHourTimezone: {
			type: String as PropType<NodeStore['businessHourTimezone']>,
			required: true,
		},
		updateBusinessHourTimes: {
			type: Function as PropType<NodeStore['updateBusinessHourTimes']>,
			required: true,
		},
		updateTimezone: {
			type: Function as PropType<NodeStore['updateTimezone']>,
			required: true,
		},
	},
	setup(props) {
		const drawer = useDrawer(() => {
			return isCurrentId(props.id, props.paramId);
		});

		return () => {
			return (
				<Drawer
					title="Business Hours"
					open={drawer.open.value}
					onClose={drawer.onClose}
				>
					<Flex
						gap={8}
						vertical
						style={{
							padding: '8px',
						}}
					>
						<Flex vertical align="flex-start" gap={8}>
							{props.businessHourTimes.map((time, index) => {
								return (
									<Flex vertical align="flex-start">
										<TypographyText>
											{capitalize(time.day)}
										</TypographyText>
										<TimeRangePicker
											valueFormat="HH:mm"
											format="HH:mm"
											value={[
												time.startTime,
												time.endTime,
											]}
											style={{
												width: '150px',
											}}
											use12Hours={false}
											onChange={(value) => {
												props.updateBusinessHourTimes(
													index,
													(value ?? []).map(
														(time) => {
															return time?.toString();
														}
													)
												);
											}}
										/>
									</Flex>
								);
							})}
						</Flex>
						<Divider />
						<Flex align="flex-start" vertical>
							<TypographyText>Timezone</TypographyText>
							<Select
								style={{
									width: '200px',
								}}
								value={props.businessHourTimezone}
								onChange={(value) => {
									props.updateTimezone(
										Defined.parse(value)
											.orThrow(
												'value for timezone is not defined'
											)
											.toString()
									);
								}}
							>
								{moment.tz
									.names()
									.map((name) => {
										const offset = moment
											.tz(name)
											.utcOffset();

										return {
											name,
											offset,
										};
									})
									.sort((a, b) => {
										return a.offset - b.offset;
									})
									.map(({ name }) => {
										const timezone = moment
											.tz(name)
											.format('Z');

										return (
											<SelectOption value={name}>
												(GMT{timezone}) {name}
											</SelectOption>
										);
									})}
							</Select>
						</Flex>
					</Flex>
				</Drawer>
			);
		};
	},
});

const DateTime = () => {
	return {
		type: 'dateTime',
		Component,
		Drawer: DateTimeDrawer,
	} as const;
};

export { DateTime };

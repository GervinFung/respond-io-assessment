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
import { DeleteNode } from './delete-node';

const Component = defineComponent({
	props: {
		id: props.id,
		title: props.title,
		value: childProps.value,
		color: childProps.color,
		size: props.size,
		onDuplicate: props.onDuplicate,
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
								color: props.color,
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
		dateTimeTimes: {
			type: Function as PropType<NodeStore['findDateTimeTimesById']>,
			required: true,
		},
		dateTimeTimezone: {
			type: Function as PropType<NodeStore['findDatetimeTimezoneById']>,
			required: true,
		},
		updateDatetimeTimes: {
			type: Function as PropType<NodeStore['updateBusinessHourTimes']>,
			required: true,
		},
		updateDatetimeTimezone: {
			type: Function as PropType<NodeStore['updateTimezone']>,
			required: true,
		},
		onDelete: childProps.onDelete,
	},
	setup(props) {
		const drawer = useDrawer(() => {
			return isCurrentId(props.id, props.paramId);
		});

		return () => {
			return (
				<Drawer
					title="Date Time Details"
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
						<Flex vertical align="flex-start" gap={16}>
							{props
								.dateTimeTimes(props.id)
								.map((time, index) => {
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
													props.updateDatetimeTimes({
														id: props.id,
														index,
														times: (
															value ?? []
														).map((time) => {
															return time?.toString();
														}),
													});
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
								value={props.dateTimeTimezone(props.id)}
								onChange={(value) => {
									props.updateDatetimeTimezone(
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
						<Divider />
						<DeleteNode onClick={props.onDelete(props)} />
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

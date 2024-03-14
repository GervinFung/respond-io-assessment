import { defineComponent } from 'vue';

const DateTimeConnector = () => {
	return {
		type: 'dateTimeConnector',
		Component: defineComponent({
			props: {
				status: {
					type: String,
					required: true,
				},
			},
			setup(props) {
				return () => {
					return (
						<div
							style={{
								borderRadius: '16px',
								border: '1px solid grey',
								padding: '8px',
							}}
						>
							{props.status}
						</div>
					);
				};
			},
		}),
	} as const;
};

export { DateTimeConnector };

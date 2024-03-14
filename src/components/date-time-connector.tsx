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
								borderRadius: '12px',
								padding: '8px',
								backgroundColor:
									props.status.toLowerCase() === 'success'
										? '#D1F2EB'
										: '#F8D7DA',
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

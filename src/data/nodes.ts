const nodes = [
	{
		id: 1,
		parentNode: undefined,
		type: 'input',
		kind: 'trigger',
		data: {
			kind: 'conversationOpened',
			oncePerContact: false,
		},
	},
	{
		name: 'Away Message',
		id: 'b6a0c1',
		type: 'default',
		kind: 'sendMessage',
		data: {
			payload: [
				{
					kind: 'text',
					text: 'Sorry, we are currently away. We will respond as soon as possible.',
				},
			],
		},
		parentNode: '28c4b9',
	},
	{
		name: 'Business Hours',
		id: 'd09c08',
		type: 'default',
		kind: 'dateTime',
		data: {
			times: [
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'mon',
				},
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'tue',
				},
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'wed',
				},
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'thu',
				},
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'fri',
				},
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'sat',
				},
				{
					startTime: '09:00',
					endTime: '17:00',
					day: 'sun',
				},
			],
		},
		connectors: ['161f52', '28c4b9'],
		timezone: 'UTC',
		action: 'businessHours',
		parentNode: 1,
	},
	{
		name: 'Success',
		id: '161f52',
		type: 'default',
		kind: 'dateTimeConnector',
		data: {
			connectorType: 'success',
		},
		parentNode: 'd09c08',
	},
	{
		name: 'Failure',
		id: '28c4b9',
		type: 'default',
		kind: 'dateTimeConnector',
		data: {
			connectorType: 'failure',
		},
		parentNode: 'd09c08',
	},
	{
		name: 'Welcome Message',
		id: 'b0653a',
		type: 'default',
		kind: 'sendMessage',
		data: {
			payload: [
				{
					kind: 'text',
					text: 'Hello there, welcome to the chat!',
				},
				{
					kind: 'attachment',
					attachment:
						'https://fastly.picsum.photos/id/396/536/354.jpg?hmac=GmUosOuXb6nGkFhmTE-83i0ciQcaleMyvIyqzeFbW58',
				},
			],
		},
		parentNode: '161f52',
	},
	{
		id: 'e879e4',
		type: 'default',
		kind: 'addComment',
		parentNode: 'b6a0c1',
		name: 'Add Comment #1',
		data: {
			comment: 'User message during off hours',
		},
	},
];

export default nodes;

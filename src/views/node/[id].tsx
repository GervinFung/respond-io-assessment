import { defineComponent } from 'vue';

import Home from '../home';

const NodeWithId = defineComponent({
	name: 'node-with-id',
	setup() {
		return () => {
			return <Home />;
		};
	},
});

export default NodeWithId;

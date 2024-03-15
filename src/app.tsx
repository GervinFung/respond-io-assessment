import { defineComponent } from 'vue';

import { RouterView } from 'vue-router';

const App = defineComponent({
	name: 'app',
	setup() {
		return () => {
			return (
				<div>
					<RouterView />
				</div>
			);
		};
	},
});

export default App;

import { defineComponent } from 'vue';

import { Position } from '@vue-flow/core';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { Button } from 'ant-design-vue';

const Toolbar = defineComponent({
	name: 'toolbar',
	setup() {
		return () => {
			return (
				<NodeToolbar isVisible position={Position.Right}>
					<Button>Action1</Button>
				</NodeToolbar>
			);
		};
	},
});

export { Toolbar };

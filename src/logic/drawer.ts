import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useDrawer = (value: () => boolean) => {
	const route = useRoute();
	const router = useRouter();

	const open = computed(() => {
		return route.query.drawer !== 'none' && value();
	});

	return {
		open,
		onClose: () => {
			router.replace({
				query: {
					drawer: 'none',
				},
			});
		},
	};
};

export { useDrawer };

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: () => {
				return import('../views/home');
			},
		},
		{
			path: '/node/:id',
			component: () => {
				return import('../views/home');
			},
		},
	],
});

export default router;

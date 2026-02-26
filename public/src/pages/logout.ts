import authApi from '../api/auth/auth.client-api.js';

document.addEventListener('DOMContentLoaded', async (e) => {
	await authApi.logout();
	window.location.href = '/';
});

import { dev } from '$app/environment';
import { io } from 'socket.io-client';

// /** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	let socket = io('https://tfe30-backend.up.railway.app');

	if (dev) {
		socket = io(import.meta.env.VITE_BACKEND_URL);
	}

	return {
		socket
	};
}

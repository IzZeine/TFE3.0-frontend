import { io } from 'socket.io-client';

// /** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const socket = io(import.meta.env.VITE_BACKEND_URL);
	return {
		socket
	};
}

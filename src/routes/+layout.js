// @ts-nocheck
import { io } from 'socket.io-client';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	let socket = io('https://tfe30-backend.up.railway.app');
	// let socket = io('http://localhost:3000');
	// let socket = io('http://192.168.0.43:3000');

	return {
		socket
	};
}

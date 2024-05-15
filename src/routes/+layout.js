// @ts-nocheck
import { io } from 'socket.io-client';
import { getMyUrlForDev } from '$lib';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const socket = io(getMyUrlForDev());

	return {
		socket
	};
}

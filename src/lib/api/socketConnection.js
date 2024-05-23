import ioClient from 'socket.io-client';
import { getMyUrlForDev } from '$lib';

// const ENDPOINT = 'http://192.168.0.43:3000';
// const ENDPOINT = 'https://tfe30-backend.up.railway.app';

const io = ioClient(getMyUrlForDev());
export const socket = io;

io.on('connect', () => {
	console.log('connected');
});

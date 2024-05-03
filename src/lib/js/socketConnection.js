import ioClient from 'socket.io-client';
const ENDPOINT = 'http://192.168.0.43:3000';

const io = ioClient(ENDPOINT);

export const socket = io;

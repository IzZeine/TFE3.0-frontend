// @ts-nocheck
import { goto } from '$app/navigation';

let clearDataBase = async (socket) => {
	socket.emit('clearAllDataBase');
	sessionStorage.clear();
	throw goto('/');
};

export { clearDataBase };

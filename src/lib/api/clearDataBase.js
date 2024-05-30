// @ts-nocheck
import { goto } from '$app/navigation';

let clearDataBase = async (socket, gameId) => {
	socket.emit('clearGameDataBase', gameId);
	sessionStorage.clear();
	throw goto('/');
};

export { clearDataBase };

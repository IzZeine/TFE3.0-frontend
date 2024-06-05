// @ts-nocheck
import { goto } from '$app/navigation';

let clearDataBase = async (socket, gameId, user) => {
	console.log(user.gameId ? 'oui' : 'non');
	if (!user.gameId) {
		socket.emit('clearGameDataBase', gameId);
	}
	sessionStorage.clear();
	goto('/');
};

export { clearDataBase };

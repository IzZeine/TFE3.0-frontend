// @ts-nocheck
import { goto } from '$app/navigation';

export const clearDataBase = async (socket, gameId, user) => {
	if (!user.gameId) {
		socket.emit('clearGameDataBase', gameId);
	}
	sessionStorage.clear();
	goto('/');
};

export const resetGame = async (socket, gameId, user) => {
	if (!user.gameId) {
		socket.emit('resetGame', gameId);
		goto(`/boardGame/${gameId}`);
		sessionStorage.clear();
	} else {
		socket.emit('resetPlayer', gameId);
		goto(`/game/${gameId}`);
	}
};

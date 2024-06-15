// @ts-nocheck

import { socket } from '$lib/api/socketConnection.js';

async function getUser(gameId) {
	let sessionID = sessionStorage.getItem(`sessionID-${gameId}`);
	if (sessionID) {
		try {
			// Attendre que la promesse soit résolue avec les données utilisateur
			return new Promise((resolve) => {
				socket.emit('getMyUser', sessionID, (user) => {
					return resolve(user);
				});
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des utilisateurs :', error);
		}
	}
	return null;
}

export { getUser };

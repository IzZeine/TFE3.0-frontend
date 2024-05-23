// @ts-nocheck

import { socket } from '$lib/api/socketConnection.js';

async function getUser() {
	let sessionID = sessionStorage.getItem('sessionID');
	console.log('getUser', sessionID);
	if (sessionID) {
		try {
			console.log('getMyUser', sessionID);
			// Attendre que la promesse soit résolue avec les données utilisateur
			return new Promise((resolve) => {
				socket.emit('getMyUser', sessionID, (user) => {
					console.log('getMyUserResponse', user);
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

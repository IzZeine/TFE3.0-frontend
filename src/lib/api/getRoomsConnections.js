// @ts-nocheck

import { getMyUrlForDev } from './getMyUrlForDev.js';

async function getRoomsConnections() {
	let url = getMyUrlForDev();
	try {
		const response = await fetch(`${url}/roomsConnections`);
		const roomsConnectionsJson = await response.json();
		return roomsConnectionsJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getRoomsConnections };

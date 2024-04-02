// @ts-nocheck

async function getRoomsConnections() {
	try {
		const response = await fetch('http://localhost:3000/roomsConnections');
		const roomsConnectionsJson = await response.json();
		return roomsConnectionsJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getRoomsConnections };

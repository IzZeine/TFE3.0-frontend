// @ts-nocheck

async function getRoomsConnections() {
	try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/roomsConnections`);
		const roomsConnectionsJson = await response.json();
		return roomsConnectionsJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getRoomsConnections };

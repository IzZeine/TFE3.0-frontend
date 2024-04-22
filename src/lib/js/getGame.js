// @ts-nocheck

async function getGame() {
	let gameID = sessionStorage.getItem('gameID');
	let game = '';
	try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/games`);
		const gamesJson = await response.json();
		game = gamesJson.find((game) => game.gameId === gameID);
		return game;
	} catch (error) {
		console.error('Erreur lors de la récupération des utilisateurs :', error);
		// Gérer l'erreur ici
	}
}

export { getGame };

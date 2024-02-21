// @ts-nocheck

async function getGame() {
	let gameID = sessionStorage.getItem('gameID');
	let game = '';
	try {
		const response = await fetch('http://localhost:3000/games');
		const gamesJson = await response.json();
		game = gamesJson.find((game) => game.gameId === gameID);
		return game;
	} catch (error) {
		console.error('Erreur lors de la récupération des utilisateurs :', error);
		// Gérer l'erreur ici
	}
}

export { getgame };

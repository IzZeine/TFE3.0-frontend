// @ts-nocheck

import { getMyUrlForDev } from './getMyUrlForDev';

async function getGame() {
	let gameID = sessionStorage.getItem('gameID');
	let game = '';
	let url = getMyUrlForDev();
	try {
		const response = await fetch(`${url}/games`);
		const gamesJson = await response.json();
		game = gamesJson.find((game) => game.gameId === gameID);
		return game;
	} catch (error) {
		console.error('Erreur lors de la récupération des utilisateurs :', error);
		// Gérer l'erreur ici
	}
}

export { getGame };

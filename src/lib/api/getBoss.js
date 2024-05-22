// @ts-nocheck

import { getMyUrlForDev } from './getMyUrlForDev.js';

async function getBoss() {
	let url = getMyUrlForDev();
	try {
		const response = await fetch(`${url}/boss`);
		const bossJson = await response.json();
		return bossJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getBoss };

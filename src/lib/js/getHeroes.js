// @ts-nocheck

import { getMyUrlForDev } from './getMyUrlForDev';

async function getHeroes() {
	let url = getMyUrlForDev();
	try {
		const response = await fetch(`${url}/heroes`);
		const heroesJson = await response.json();
		return heroesJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getHeroes };

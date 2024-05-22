// @ts-nocheck

import { getMyUrlForDev } from './getMyUrlForDev.js';

async function getItems() {
	let url = getMyUrlForDev();
	try {
		const response = await fetch(`${url}/items`);
		const itemsJson = await response.json();
		return itemsJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des items :', error);
		// Gérer l'erreur ici
	}
}

export { getItems };

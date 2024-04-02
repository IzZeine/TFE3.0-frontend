// @ts-nocheck

async function getItems() {
	try {
		const response = await fetch('http://localhost:3000/items');
		const itemsJson = await response.json();
		return itemsJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des items :', error);
		// Gérer l'erreur ici
	}
}

export { getItems };

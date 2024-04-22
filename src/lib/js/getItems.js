// @ts-nocheck

async function getItems() {
	try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/items`);
		const itemsJson = await response.json();
		return itemsJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des items :', error);
		// Gérer l'erreur ici
	}
}

export { getItems };

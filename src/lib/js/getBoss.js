// @ts-nocheck

async function getBoss() {
	try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/boss`);
		const bossJson = await response.json();
		return bossJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getBoss };

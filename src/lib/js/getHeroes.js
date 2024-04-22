// @ts-nocheck

async function getHeroes() {
	try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/heroes`);
		const heroesJson = await response.json();
		return heroesJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getHeroes };

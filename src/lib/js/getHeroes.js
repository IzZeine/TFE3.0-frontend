// @ts-nocheck

async function getHeroes() {
	try {
		const response = await fetch('http://localhost:3000/heroes');
		const heroesJson = await response.json();
		return heroesJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getHeroes };

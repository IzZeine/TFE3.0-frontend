// @ts-nocheck

async function getBoss() {
	try {
		const response = await fetch('http://localhost:3000/boss');
		const bossJson = await response.json();
		return bossJson;
	} catch (error) {
		console.error('Erreur lors de la récupération des heros :', error);
		// Gérer l'erreur ici
	}
}

export { getBoss };

// @ts-nocheck

async function getUser() {
	let sessionID = sessionStorage.getItem('sessionID');
	let user = '';
	console.log('function done');
	try {
		const response = await fetch('http://localhost:3000/users');
		const usersJson = await response.json();
		user = usersJson.find((user) => user.ID === sessionID);
		return user;
	} catch (error) {
		console.error('Erreur lors de la récupération des utilisateurs :', error);
		// Gérer l'erreur ici
	}
}

export { getUser };

// @ts-nocheck

async function getUser(socket) {
	let sessionID = sessionStorage.getItem('sessionID');
	try {
		let userDataPromise = new Promise((resolve, reject) => {
			socket.on('ThisIsYourUser', (data) => {
				resolve(data); // Résoudre la promesse avec les données utilisateur
			});
		});

		// Émettre la demande pour obtenir l'utilisateur
		socket.emit('getMyUser', sessionID);

		// Attendre que la promesse soit résolue avec les données utilisateur
		let user = await userDataPromise;
		console.log(user);
		return user;
	} catch (error) {
		console.error('Erreur lors de la récupération des utilisateurs :', error);
		// Gérer l'erreur ici
	}
}

export { getUser };

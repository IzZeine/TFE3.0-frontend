// @ts-nocheck

// async function getUser() {
// 	let sessionID = sessionStorage.getItem('sessionID');
// 	let user = '';
// 	try {
// 		const response = await fetch('http://localhost:3000/users');
// 		const usersJson = await response.json();
// 		user = usersJson.find((user) => user.Id == sessionID);
// 		console.log('user : ', user);
// 		return user;
// 	} catch (error) {
// 		console.error('Erreur lors de la récupération des utilisateurs :', error);
// 		// Gérer l'erreur ici
// 	}
// }
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

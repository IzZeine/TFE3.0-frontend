// @ts-nocheck

async function getUser(socket) {
	let sessionID = sessionStorage.getItem('sessionID');
	console.log('getUser', sessionID);
	if (sessionID) {
		try {
			console.log('getMyUser', sessionID);
			// Attendre que la promesse soit résolue avec les données utilisateur
			return new Promise((resolve, reject) => {
				socket.emit('getMyUser', sessionID, (user) => {
					console.log('getMyUserResponse', user);
					if (user) return resolve(user);
					reject();
				});
			});
		} catch (error) {
			console.error('Erreur lors de la récupération des utilisateurs :', error);
		}
	}
	return null;
}

export { getUser };

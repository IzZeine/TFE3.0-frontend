import { getMyUrlForDev } from '$lib';

//Single way to make API requests
export async function callBackend(fetch, method, url, data) {
	console.log(method, `${getMyUrlForDev()}${url}`);
	return fetch(`${getMyUrlForDev()}${url}`, {
		method,
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' }
	}).then(async (r) => ({
		...r,
		ok: r.ok,
		headers: r.headers,
		data: await r.json()
	}));
}

export async function createGame(fetch, name) {
	return callBackend(fetch, 'POST', '/creategame', { name });
}

export async function getGame(fetch, gameId) {
	//TODO: refactor URL to get a single game with /game/{gameId}
	const response = await callBackend(fetch, 'GET', `/games`);
	if (response.ok) {
		const game = response.data.find((game) => game.gameId === gameId);
		if (game) {
			return game;
		}
	}
	//@TODO : return to the homepage if the game doesn't exist (and clear sessionStorage)
	throw new Error(`Could not find game with id : ${gameId}`);
}

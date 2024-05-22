import { getGame, getRoomsConnections } from '$lib/api/actions.js';

export const load = async ({ params, fetch }) => {
	const gameId = params.slug;
	const initialGameData = await getGame(fetch, gameId);
	const roomsConnections = await getRoomsConnections(fetch);

	return {
		initialGameData,
		gameId,
		roomsConnections
	};
};

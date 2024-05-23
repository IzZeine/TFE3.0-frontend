import { getGame, getRoomsConnections } from '$lib/api/actions.js';

export const load = async ({ params, fetch, parent }) => {
	const { game } = await parent();
	const gameId = params.slug;

	const roomsConnections = await getRoomsConnections(fetch);

	return {
		initialGameData: game,
		gameId,
		roomsConnections
	};
};

import { getRoomsConnections, getHeroes, getBoss, getItems } from '$lib/api/actions.js';

export const load = async ({ params, fetch, parent }) => {
	const { game } = await parent();
	const gameId = params.slug;

	const roomsConnections = await getRoomsConnections(fetch);
	const heroes = await getHeroes(fetch);
	const boss = await getBoss(fetch);
	const items = await getItems(fetch);

	return {
		initialGameData: game,
		gameId,
		roomsConnections,
		heroes,
		boss,
		items
	};
};

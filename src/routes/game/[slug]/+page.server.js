import { getGame } from '$lib/api/actions.js';

export const load = async ({ params, fetch }) => {
	const gameId = params.slug;
	const initialGameData = await getGame(fetch, gameId);

	return {
		initialGameData,
		gameId
	};
};

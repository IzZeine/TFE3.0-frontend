import { getGame } from '$lib/api/actions.js';

export const load = async ({ params, fetch }) => {
	const gameId = params.slug;
	const initialGameData = await getGame(fetch, params.slug);

	return {
		initialGameData,
		gameId
	};
};

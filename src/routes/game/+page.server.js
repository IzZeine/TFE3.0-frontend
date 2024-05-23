import { getGames } from '$lib/api/actions.js';

export const load = async ({ fetch }) => {
	const games = await getGames(fetch);

	return {
		games
	};
};

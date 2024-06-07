import { getGame } from '$lib/api/actions.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const gameId = params.slug;
	console.log(gameId);
	const game = await getGame(fetch, gameId);
	// console.log('is a game?', game.gameId);
	if (!game) return redirect(301, '/game');

	return {
		game,
		gameId
	};
};

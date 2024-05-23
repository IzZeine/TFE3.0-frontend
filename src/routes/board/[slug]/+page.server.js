import { getGame } from '$lib/api/actions.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const gameId = params.slug;
	const initialGameData = await getGame(fetch, params.slug);
	if (!initialGameData){
		return redirect(301, "/board")
	}
	return {
		initialGameData,
		gameId
	};
};

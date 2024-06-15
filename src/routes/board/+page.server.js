import { createGame } from '$lib/api/actions.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ fetch, request }) => {
		const data = await request.formData();
		const gameName = data.get('gameName');
		if (!gameName) {
			return fail(400, { error: true, message: 'gameName is required' });
		}

		const response = await createGame(fetch, gameName);

		if (response.ok) {
			// Gérer la réponse si nécessaire
			console.log('Game created successfully');
			const { gameId } = await response.data;
			redirect(301, `/board/${gameId}`);
		} else {
			console.error('Failed to create game');
			return fail(400, { error: true, message: 'gameNameAlreadyExist' });
		}
	}
};

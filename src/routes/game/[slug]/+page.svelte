<script>
	import { onMount } from 'svelte';
	import GameRules from '$lib/game/GameRules.svelte';
	import ChooseHero from '$lib/game/ChooseHero.svelte';
	import EndGame from '$lib/board/EndGame.svelte';
	import Map from '$lib/game/Map/Map.svelte';
	import { goto } from '$app/navigation';
	import { socket } from '$lib/api/socketConnection.js';
	import { getUser } from '$lib/api/getUsers.js';
	import { user } from '$lib/api/stores.js';

	export let data;
	const { initialGameData, gameId, heroes, boss, items } = data;

	let game = { ...initialGameData };

	let winner = null;

	const updateGame = async (data) => {
		// console.log('[game] update game', data);
		// console.log('[game] update game user', $user);
		user.set(data.users.find(({ id }) => id === $user.id));
		game = data;
	};

	onMount(async () => {
		console.log(`[game] onMount game : ${gameId}`);
		socket.emit('joinGame', gameId);
		user.set(await getUser(gameId));
		console.log('[game] user', $user);
		if (!$user) {
			console.log('no user go to create one');
			sessionStorage.clear();
			await goto(`/game/${gameId}/user`);
		} else {
			socket.on('updateGame', updateGame);
		}
		return () => {
			socket.off(updateGame);
		};
	});

	function sentHeroToServer(event) {
		let hero = event.detail.hero;
		socket.emit('selectedHero', hero);
		//socket.emit('playSound', 'power'); // @TODO : sound select
	}
</script>

{#if user}
	{#if game.statut === 'waiting'}
		<GameRules />
	{/if}
	{#if game.statut === 'closed'}
		<ChooseHero {heroes} {boss} on:ChooseHero={sentHeroToServer} />
	{/if}
	{#if game.statut === 'started'}
		<Map {items} {game} />
	{/if}
	{#if game.statut === 'ended'}
		<EndGame {winner} />
	{/if}
{/if}

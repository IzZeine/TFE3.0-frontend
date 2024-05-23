<script>
	import { onMount } from 'svelte';
	import GameRules from '$lib/game/GameRules.svelte';
	import ChooseHero from '$lib/game/ChooseHero.svelte';
	import EndGame from '$lib/board/EndGame.svelte';
	import Map from '$lib/game/Map/Map.svelte';
	import { goto } from '$app/navigation';
	import { socket } from '$lib/api/socketConnection.js';
	import { getUser } from '$lib/api/getUsers.js';

	export let data;
	const { initialGameData, gameId } = data;

	let game = initialGameData;

	let sessionID = '';
	let user = '';
	let hero = '';
	let winner = null;

	onMount(async () => {
		// trouver l'utilisateur
		user = await getUser(socket);
		console.log('user', user);
		if (!user) {
			sessionStorage.clear();
			return goto(`/game/${gameId}/user`);
		}
		socket.emit('joinGame', gameId);

		console.log('session Id :', sessionID);

		socket.on('endGame', (data) => {
			winner = data;
			console.log(data);
		});

		socket.on('updateGame', (data) => {
			game = data;
		});
	});

	function sentHeroToServer(event) {
		hero = event.detail.hero;
		socket.emit('selectedHero', hero);
		socket.emit('playSound', 'power'); // @TODO : sound select
	}
</script>

{#if sessionID}
	{#if user}
		{#if game.statut === 'waiting'}
			<GameRules />
		{/if}
		{#if game.statut === 'closed'}
			<ChooseHero {user} on:ChooseHero={sentHeroToServer} />
		{/if}
		{#if game.statut === 'started'}
			<Map {user} />
		{/if}
		{#if game.statut === 'ended'}
			<EndGame {winner} />
		{/if}
	{/if}
{/if}

<!-- <button on:click={clearStorage}>Clear</button> -->

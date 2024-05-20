<script>
	import { onMount } from 'svelte';
	import { getHeroes, getItems, getUser, clearStorage } from '$lib';
	import GameRules from '$lib/game/GameRules.svelte';
	import ChooseHero from '$lib/game/ChooseHero.svelte';
	import EndGame from '$lib/board/EndGame.svelte';
	import Map from '$lib/game/Map/Map.svelte';
	import { goto } from '$app/navigation';
	import { socket } from '$lib/api/socketConnection.js';

	export let data;
	const { initialGameData, gameId } = data;

	let game = initialGameData;

	let sessionID = '';
	let user = '';
	let hero = '';
	let winner = null;

	onMount(async () => {
		sessionID = sessionStorage.getItem('sessionID') || '';
		if (!sessionID) {
			clearStorage();
			goto('/');
		}

		// trouver l'utilisateur
		user = await getUser(socket);
		if (!user) {
			clearStorage();
			goto('/');
		}
		socket.emit('joinGame', gameId);

		console.log('session Id :', sessionID);

		// @TODO : deco intempestives...
		socket.on('deco', () => {
			alert('a lot of users');
			clearStorage();
		});

		//importer les heros
		let listOfHeroes = await getHeroes();
		//importer les items
		let listOfItems = await getItems();

		socket.on('updateUsers', async (data) => {
			user = await getUser(socket);
			if (!user) throw goto('/');
		});

		socket.on('endGame', (data) => {
			winner = data;
			console.log(data);
		});

		socket.on('updateGame', (data) => {
			game = data;
		});

		// mettre à jour le user quand le hero a été choisi et enregistré dans la db
		socket.on('registeredHero', async () => {
			user = await getUser(socket);
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

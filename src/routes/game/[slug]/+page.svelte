<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getHeroes, getItems, getUser, clearStorage, getGame } from '$lib';
	import GameRules from '$lib/composants/GameRules.svelte';
	import ChooseHero from '$lib/composants/ChooseHero.svelte';
	import EndGame from '$lib/composants/EndGame.svelte';
	import Map from '$lib/composants/Map.svelte';
	import { goto } from '$app/navigation';
	import { socket } from '$lib/js/socketConnection.js';

	let gameID = '';
	let sessionID = '';
	let user = '';
	let game = '';
	let hero = '';
	let listOfItems = '';
	let listOfHeroes = '';
	let winner = null;

	onMount(async () => {
		onResize();
		sessionID = sessionStorage.getItem('sessionID');
		if (!sessionID) {
			clearStorage();
			goto('/');
		}

		gameID = sessionStorage.getItem('gameID');
		if (!gameID) {
			goto('/game');
		}else{
			// trouver l'utilisateur
			user = await getUser(socket);
				if (!user) {
					clearStorage();
					goto('/');
				}
				socket.emit('joinGame', gameID);
		}

		console.log('session Id :', sessionID);
		console.log('gameID', gameID);

		// @TODO : deco intempestives...
		socket.on('deco', () => {
			alert('a lot of users');
			clearStorage();
			goto('/game');
		});

		//trouver la game
		game = await getGame();
		//importer les heros
		listOfHeroes = await getHeroes();
		//importer les items
		listOfItems = await getItems();

		socket.on('updateUsers', async (data) => {
			user = await getUser(socket);
			if(!user) throw goto('/')
		});

		socket.on('endGame', (data) => {
			winner = data
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
	}



	let innerWidth;
	const onResize = () => {
		if (innerWidth > 500) {
			goto('/boardGame');
		}
	};
</script>

<svelte:window on:resize={onResize} bind:innerWidth />

{#if sessionID}
	{#if user}
		{#if game.statut == 'waiting'}
			<GameRules />
		{/if}
		{#if game.statut == 'closed'}
			<ChooseHero {user} on:ChooseHero={sentHeroToServer} />
		{/if}
		{#if game.statut == 'started'}
			<Map {user} />
		{/if}
		{#if game.statut == 'ended'}
			<EndGame {winner} />
		{/if}
	{/if}
{/if}
<button on:click={clearStorage}>Clear</button>

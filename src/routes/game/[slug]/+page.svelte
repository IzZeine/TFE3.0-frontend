<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getHeroes, getItems, getUser, clearStorage, getGame } from '$lib';
	import GameRules from '$lib/composants/GameRules.svelte';
	import ChooseHero from '$lib/composants/ChooseHero.svelte';
	import Map from '$lib/composants/Map.svelte';

	export let data;
	const socket = data.socket;

	let gameID = ''; // tout doit être relatif à la partie en cours
	let sessionID = '';
	let user = '';
	let game = '';
	let hero = '';
	let listOfItems = '';
	let listOfHeroes = '';
	let wait = true;

	onMount(async () => {
		sessionID = sessionStorage.getItem('sessionID');
		if (!sessionID) {
			clearStorage();
			window.location.href = '/';
		}

		gameID = sessionStorage.getItem('gameID');
		if (!gameID) {
			window.location.href = '/game';
		}

		console.log('session Id :', sessionID);
		console.log('gameID', gameID);

		socket.on('connect', async () => {
			console.log('Connected to server');
			if (gameID) {
				// trouver l'utilisateur
				user = await getUser(socket);
				if (!user) {
					clearStorage();
					window.location.href = '/';
				}
				socket.emit('joinGame', gameID);
			}
		});

		// @TODO : deco intempestives...
		socket.on('deco', () => {
			alert('a lot of users');
			clearStorage();
			window.location.href = '/game';
		});

		if (screen.width > 500) {
			{
				window.location.href = '/boardGame';
			}
		}

		//trouver la game
		game = await getGame();
		//importer les heros
		listOfHeroes = await getHeroes();
		//importer les items
		listOfItems = await getItems();

		socket.on('updateUsers', async (data) => {
			user = await getUser(socket);
		});
	});

	socket.on('updateGame', (data) => {
		game = data;
	});

	socket.on('wait', () => {
		wait = true;
	});

	function sentHeroToServer(event) {
		hero = event.detail.hero;
		socket.emit('selectedHero', hero);
	}

	// mettre à jour le user quand le hero a été choisi et enregistré dans la db
	socket.on('registeredHero', async () => {
		user = await getUser(socket);
	});
</script>

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
	{/if}
{/if}
<button on:click={clearStorage}>Clear</button>

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
	const { initialGameData, gameId, heroes, boss } = data;

	let game = { ...initialGameData };

	let user = '';
	let winner = null;

	const updateGame = (data) => {
		user = data.users.find(({ id }) => id === user.id);
		game = data;
	};

	onMount(async () => {
		console.log(`onMount game : ${gameId}`);
		// trouver l'utilisateur
		user = await getUser(socket);
		console.log('user', user);
		if (user) {
			socket.emit('joinGame', gameId);
			socket.on('updateGame', updateGame);
		} else {
			console.log('no user go to create one');
			sessionStorage.clear();
			goto(`/game/${gameId}/user`);
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

{#if game.statut === 'waiting'}
	<GameRules />
{/if}
{#if game.statut === 'closed'}
	<ChooseHero {user} {heroes} {boss} on:ChooseHero={sentHeroToServer} />
{/if}
{#if game.statut === 'started'}
	<Map {user} />
{/if}
{#if game.statut === 'ended'}
	<EndGame {winner} />
{/if}

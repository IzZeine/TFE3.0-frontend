<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import PlayerCard from '$lib/board/lobby/PlayerCard.svelte';

	let activeUsers = [];
	let numberOfColGrid = 6;
	let winner = null;

	export let game;
	export let gameId;

	let btnPlayDisabled = false;
	let btnCloseDisabled = true;

	let conditionHero = (currentValue) => currentValue.hero;

	const onUpdateUsers = (data) => {
		activeUsers = data;
		if (activeUsers.length >= 2 && game.statut === 'waiting') {
			btnCloseDisabled = false;
		}
		if (activeUsers.length === 6 && game.statut === 'waiting') {
			closeGame();
		}
		if (activeUsers.length >= 2 && activeUsers.every(conditionHero) && game.statut === 'closed') {
			btnPlayDisabled = false;
		}
	};
	const onEndGame = (data) => {
		winner = data;
		console.log(data);
	};

	const closeGame = () => {
		socket.emit('closeGame', gameId);
	};

	const openGame = () => {
		socket.emit('openGame', gameId);
	};

	const startGame = () => {
		socket.emit('startGame', gameId);
	};

	onMount(() => {
		socket.emit('isActiveUsers', gameId);
		socket.on('updateUsers', onUpdateUsers);
		socket.on('endGame', onEndGame);

		return () => {
			socket.off('updateUsers', onUpdateUsers);
			socket.off('endGame', onEndGame);
		};
	});
</script>

<div class="container">
	<h1 class="h1">{game.name} ({game.statut})</h1>
	<ul class="cardUserList" style={{ '--numberOfCols': numberOfColGrid }}>
		{#each activeUsers as user}
			<li>
				<PlayerCard {user} {game} />
			</li>
		{/each}
	</ul>

	{#if game.statut === 'closed'}
		<button class="btnPrimary" disabled={btnPlayDisabled} on:click={startGame}>Jouer</button>
		<button class="btnPrimary" disabled={btnPlayDisabled} on:click={openGame}>ouvrir</button>
	{:else}
		<button class="btnPrimary js-btn-close" disabled={btnCloseDisabled} on:click={closeGame}
			>Fermer</button
		>
	{/if}
</div>

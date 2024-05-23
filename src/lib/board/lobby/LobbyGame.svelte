<script>
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import PlayerCard from '$lib/board/lobby/PlayerCard.svelte';

	let winner = null;

	export let game;

	let activeUsers = game.users;
	export let gameId;

	let btnPlayDisabled = false;
	let btnCloseDisabled = true;

	let conditionHero = (currentValue) => currentValue.hero;

	const onUpdateUsers = (data) => {
		console.log('onUpdateUsers',data);
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
		socket.on('updateUsers', onUpdateUsers);
		socket.on('endGame', onEndGame);

		return () => {
			socket.off('updateUsers', onUpdateUsers);
			socket.off('endGame', onEndGame);
		};
	});
</script>

<div class="container">
	<h1 class="h1">{game.name} <span class="h2">({game.statut})</span></h1>
	<ul class="cardUserList">
		{#each activeUsers as user, index}
			{@const numberOfLi = 6 - activeUsers.length}
			{@const isLast = index === activeUsers.length - 1}
			<li>
				<PlayerCard {user} {game} />
			</li>
			{#if isLast}
				{#each { length: numberOfLi } as _, index}
					<li class="cardUser-Empty"></li>
				{/each}
			{/if}
		{/each}
	</ul>

	{#if game.statut === 'closed'}
		<button class="btnPrimary" disabled={btnPlayDisabled} on:click={startGame}>Jouer</button>
		<button class="btnPrimary" disabled={btnPlayDisabled} on:click={openGame}>ouvrir</button>
	{:else}
		<button class="btnPrimary js-btn-close" disabled={btnCloseDisabled} on:click={closeGame}>
			Fermer
		</button>
	{/if}
</div>

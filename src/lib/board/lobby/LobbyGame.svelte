<script>
	import { socket } from '$lib/api/socketConnection.js';
	import PlayerCard from '$lib/board/lobby/PlayerCard.svelte';

	let winner = null;

	export let game;

	let activeUsers = [];
	export let gameId;

	let btnPlayDisabled = false;
	let btnCloseDisabled = true;

	let conditionHero = (currentValue) => currentValue.hero;

	$: {
		activeUsers = game.users;
		console.log('activeUsers')
		if (activeUsers.length >= 2 && game.statut === 'waiting') {
			btnCloseDisabled = false;
		}
		if (activeUsers.length === 6 && game.statut === 'waiting') {
			closeGame();
		}
		if (activeUsers.length >= 2 && activeUsers.every(conditionHero) && game.statut === 'closed') {
			btnPlayDisabled = false;
		}
	}

	const closeGame = () => {
		socket.emit('closeGame', gameId);
	};

	const openGame = () => {
		socket.emit('openGame', gameId);
	};

	const startGame = () => {
		socket.emit('startGame', gameId);
	};
</script>

<div class="container">
	<h1 class="h1">{game.name} <span class="h2">({game.statut})</span></h1>
	<ul class="cardUserList">
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
		<button class="btnPrimary js-btn-close" disabled={btnCloseDisabled} on:click={closeGame}>
			Fermer
		</button>
	{/if}
</div>

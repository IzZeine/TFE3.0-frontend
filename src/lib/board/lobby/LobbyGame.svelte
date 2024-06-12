<script>
	import { socket } from '$lib/api/socketConnection.js';
	import PlayerCard from '$lib/board/lobby/PlayerCard.svelte';
	import QrCode from '../QRCode.svelte';
	import { _ } from 'svelte-i18n';

	export let game;

	let activeUsers = [];
	export let gameId;

	let btnPlayDisabled = true;
	let btnCloseDisabled = true;

	let conditionHero = (currentValue) => currentValue.hero;

	$: {
		activeUsers = game.users;
		console.log('activeUsers');
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

	<div class="btnGame">
		{#if game.statut === 'closed'}
			<button class="btnPrimary" disabled={btnPlayDisabled} on:click={startGame}
				>{$_('common.play')}</button
			>
			<button class="btnPrimary" on:click={openGame}>{$_('desktop.lobby.open')}</button>
		{:else}
			<button class="btnPrimary js-btn-close" disabled={btnCloseDisabled} on:click={closeGame}>
				{$_('desktop.lobby.close')}
			</button>
		{/if}
	</div>
</div>

<QrCode />

<style>
	.btnGame {
		display: flex;
		gap: 12px;
	}
</style>

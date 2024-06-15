<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import BoardGame from '$lib/board/game/BoardGame.svelte';
	import EndGame from '$lib/board/EndGame.svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import LobbyGame from '$lib/board/lobby/LobbyGame.svelte';

	let winner = null;

	// eslint-disable-next-line no-undef
	export let data;

	const { initialGameData, gameId, roomsInfos } = data;

	let game = initialGameData;

	const onUpdateGame = (data) => {
		game = data;
	};

	const onEndGame = (data) => {
		winner = data;
	};

	onMount(async () => {
		console.log('joining game', game);
		socket.emit('joinGame', game.gameId);
		socket.on('updateGame', onUpdateGame);
		socket.on('endGame', onEndGame);
		return () => {
			socket.off('updateGame', onUpdateGame);
			socket.off('endGame', onEndGame);
		};
	});
</script>

{#if game.statut === 'started'}
	<BoardGame {game} {roomsInfos} />
{:else if game.statut === 'ended'}
	<EndGame {game} />
{:else}
	<LobbyGame {game} {gameId} />
{/if}

<!-- <button on:click={clearStorage}>Clear</button>
<button on:click={()=> clearDataBase(socket)}>Reset dataBase</button> -->

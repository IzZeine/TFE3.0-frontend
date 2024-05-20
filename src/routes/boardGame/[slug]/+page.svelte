<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import BoardGame from '$lib/board/game/BoardGame.svelte';
	import EndGame from '$lib/board/EndGame.svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import Audio from '$lib/audio/AudioPlayer.svelte';
	import LobbyGame from '$lib/board/lobby/LobbyGame.svelte';

	let activeUsers = [];
	let winner = null;

	// eslint-disable-next-line no-undef
	export let data;

	const { initialGameData, gameId } = data;

	let game = initialGameData;

	/*
	const audioFiles = [
		'/assets/sounds/dungeon.mp3',
		'/assets/sounds/power.mp3',
		'/assets/sounds/sword.mp3',
		'/assets/sounds/woosh.mp3'
	];
	*/

	const onUpdateGame =  (data) => {
		game = data;
	}
	const onEndGame =(data) => {
		winner = data;
		console.log('onEndGame', data);
	};

	onMount(async () => {
		socket.emit('isActiveUsers', gameId);
		socket.on('updateGame',onUpdateGame);
		socket.on('endGame',onEndGame);
		return ()=>{
			socket.off('updateGame', onUpdateGame)
			socket.off('endGame', onEndGame)
		}
	});


</script>

<Audio src="/assets/sounds/dungeon.mp3" loop={true} id="dungeon" volume={0.5} />

{#if game.statut === 'started'}
	<BoardGame {activeUsers} />
{:else if game.statut === 'ended'}
	<EndGame {winner} />
{:else}
	<LobbyGame {game} {gameId} />
{/if}

<!-- <button on:click={clearStorage}>Clear</button>
<button on:click={()=> clearDataBase(socket)}>Reset dataBase</button> -->

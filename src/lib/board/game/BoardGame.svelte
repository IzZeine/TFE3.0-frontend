<script>
	import Player from '$lib/board/game/Player.svelte';
	import BoardGameSVG from '$lib/board/game/BoardGameSVG.svelte';
	import Battles from '$lib/board/game/Battles.svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import Room from './Room.svelte';

	//Game status
	export let game;

	let activeUsers;
	$: activeUsers = game.users;
	let boardElement;

	const onUpdateUsers = (players) => {
		// console.log('[boardGame] onUpdateusers', players);
		activeUsers = players.map((player) => {
			return {
				...player
			};
		});
	};

	onMount(() => {
		socket.on('updateUsers', onUpdateUsers);
		return () => {
			socket.off('updateUsers', onUpdateUsers);
		};
	});
</script>

<div class="boardGame">
	<div class="usersPawnList">
		{#each { length: 39 } as _, index}
			<Room {activeUsers} {index} />
		{/each}
	</div>
	<img class="fluidimg boardGameImg" src="/assets/img/boardgame.png" alt="boardgame" />
	<BoardGameSVG bind:this={boardElement} />
	<Battles {activeUsers} />
</div>

<style>
	:global(svg) {
		max-width: 100%;
		height: auto;
		display: block;
		color: rgba(255, 255, 255, 0);
	}
</style>

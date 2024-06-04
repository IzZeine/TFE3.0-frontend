<script>
	import BoardGameSVG from '$lib/board/game/BoardGameSVG.svelte';
	import Battles from '$lib/board/game/Battles.svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import Room from './Room.svelte';
	import Logs from './Logs.svelte';

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

<div class="game">
	<div class="boardGame">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="boardgame" />
		<div class="rooms">
			{#each { length: 39 } as _, index}
				<Room {activeUsers} {index} />
			{/each}
		</div>
		<div class="svgBoard">
			<BoardGameSVG bind:this={boardElement} />
		</div>
		<Battles {activeUsers} />
	</div>
	<Logs />
</div>

<style lang="scss">
	:global(svg) {
		max-width: 100%;
		height: auto;
		display: block;
		color: rgba(255, 255, 255, 0);
	}

	.game {
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 1fr 0.25fr;
		background-color: #0b0b0b;
		box-sizing: border-box;
		border: solid 3px var(--txtPrimary);
		overflow: hidden;
	}

	.boardGame {
		position: relative;
		align-self: center;
	}

	.svgBoard {
		position: absolute;
		top: 0;
	}
</style>

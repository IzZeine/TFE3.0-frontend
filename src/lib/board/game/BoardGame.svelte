<script>
	import BoardGameSVG from '$lib/board/game/BoardGameSVG.svelte';
	import Battles from '$lib/board/game/Battles.svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import Room from './Room.svelte';
	import Logs from './Logs.svelte';
	import GameInfos from './GameInfos.svelte';
	import Settings from './settings.svelte';
	import TurnsInfos from './TurnsInfos.svelte';
	import EndGameInfos from './endGameInfos.svelte';

	//Game status
	export let game, roomsInfos;

	let activeUsers;
	$: activeUsers = game.users;
	let boardElement;

	const onUpdateUsers = (players) => {
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
		<div class="svgBoard">
			<div class="rooms">
				{#each { length: 39 } as _, index}
					<Room {activeUsers} {index} />
				{/each}
			</div>
			<img class="fluidimg" src="/assets/img/boardgame.png" alt="boardgame" />
			<BoardGameSVG bind:this={boardElement} />
		</div>
		<Battles {activeUsers} />
		<TurnsInfos />
		<EndGameInfos />
	</div>

	<div class="right">
		<GameInfos {activeUsers} {game} />
		<Logs {roomsInfos} />
	</div>
	<Settings />
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
		// overflow: hidden;
	}

	.boardGame {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.svgBoard {
		position: relative;
	}

	.right {
		height: 100%;
		display: grid;
		grid-template-rows: auto 1fr;
		border-left: solid 3px var(--txtPrimary);
		overflow: hidden;
	}
	.rooms {
		position: absolute;
		top: 0;
	}
</style>

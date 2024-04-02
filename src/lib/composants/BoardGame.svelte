<script>
	// @ts-nocheck
	import BoardGameSVG from '$lib/composants/BoardGameSVG.svelte';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	const socket = io('http://localhost:3000');

	export let activeUsers = activeUsers;

	onMount(async () => {
		positionOfPlayers();
		socket.on('updateUsers', (data) => {
			activeUsers = data;
			positionOfPlayers();
		});
	});

	let positionOfPlayers = () => {
		for (let player of activeUsers) {
			let target = 'room' + player.room + '_' + player.player;
			console.log(target);

			let myPlayerDiv = document.querySelector('#' + player.player);
			let targetDiv = document.querySelector('#' + target);

			let targetBoundingClientRect = targetDiv.getBoundingClientRect();
			let TargetX = targetBoundingClientRect.x;
			let TargetY = targetBoundingClientRect.y;

			myPlayerDiv.style.top = TargetY + 'px';
			myPlayerDiv.style.left = TargetX + 'px';
		}
	};

	let playerMove = (userId) => {
		let userMove = activeUsers.find((id) => id.id === userId);
		let target = 'room' + userMove.room + '_' + userMove.player;

		let myPlayerDiv = document.querySelector('#' + userMove.player);
		let targetDiv = document.querySelector('#' + target);

		let targetBoundingClientRect = targetDiv.getBoundingClientRect();
		let TargetX = targetBoundingClientRect.x;
		let TargetY = targetBoundingClientRect.y;

		myPlayerDiv.style.top = TargetY + 'px';
		myPlayerDiv.style.left = TargetX + 'px';
	};

	socket.on('movePlayer', (userId) => {
		socket.on('updateUsers', (data) => {
			activeUsers = data;
		});
		playerMove(userId);
	});
</script>

<div class="boardGame">
	<ul class="usersPawnList">
		{#each activeUsers as user}
			<li class="userPawn" id={user.player}>
				<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
			</li>
		{/each}
	</ul>
	<img class="fluidimg boardGameImg" src="/assets/img/boardgame.png" alt="boardgame" />
	<BoardGameSVG />
</div>

<style>
	:global(svg) {
		max-width: 100%;
		height: auto;
		display: block;
		color: rgba(255, 255, 255, 0);
	}
</style>

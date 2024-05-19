<script>
	import Player from '$lib/board/Player.svelte';
	import BoardGameSVG from '$lib/board/BoardGameSVG.svelte';
	import Battles from '$lib/board/Battles.svelte';
	import { socket } from '$lib/api/socketConnection.js';


/*
	socket.on('updateUsers', (data) => {
		activeUsers = data;
		let conditionHero = (currentValue) => currentValue.hero;
		if (activeUsers.length >= 2 && game.statut == 'waiting') {
			let btnClose = document.querySelector('.js-btn-close');
			btnClose.removeAttribute('disabled');
		}
		if (activeUsers.length == 6 && game.statut == 'waiting') {
			closeGame();
		}
		if (activeUsers.length >= 2 && activeUsers.every(conditionHero) && game.statut == 'closed') {
			let btnPlay = document.querySelector('.js-btn-play');
			btnPlay.removeAttribute('disabled');
		}
	});
*/

	//Game status
	let activeUsers = [];

	socket.on('updateUsers', (players) => {
		activeUsers = players.map((player) => {
			return {
				...player
				//Faire ici des calculs eventuels
			};
		});
	});

	socket.on('usedPower', (id, hero) => {
		console.log(id, hero);
		let img = 'power';
		if (hero === 'Chevalier') img = 'potionSpeed';
		if (hero === 'Druide') img = 'life';
		if (hero === 'Magicien') img = 'diceRoll';
		if (hero === 'Serpent') img = 'diceRoll';
		if (hero === 'Rodeur') img = 'power';
		if (hero === 'Necromancien') img = 'angel';
		//animOnPlayer(id, img);
	});
</script>

<div class="boardGame">
	<ul class="usersPawnList">
		{#each $activeUsers as user}
			<Player {user} />
		{/each}
	</ul>
	<img class="fluidimg boardGameImg" src="/assets/img/boardgame.png" alt="boardgame" />
	<BoardGameSVG />
	<Battles />
</div>

<style>
	:global(svg) {
		max-width: 100%;
		height: auto;
		display: block;
		color: rgba(255, 255, 255, 0);
	}
</style>

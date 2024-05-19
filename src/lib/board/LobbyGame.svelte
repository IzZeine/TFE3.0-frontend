<script>
	// @ts-nocheck

	import { clearStorage, getGame, getHeroes } from '$lib';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BoardGame from '$lib/board/BoardGame.svelte';
	import EndGame from '$lib/board/EndGame.svelte';
	import { socket } from '$lib/js/socketConnection.js';
	import Audio from '$lib/audio/AudioPlayer.svelte';
	import LobbyGame from '$lib/board/LobbyGame.svelte';

	let game = '';
	let activeUsers = [];
	let listOfHeroes = [];
	let numberOfColGrid;
	let winner = null;

	const audioFiles = [
		'/assets/sounds/dungeon.mp3',
		'/assets/sounds/power.mp3',
		'/assets/sounds/sword.mp3',
		'/assets/sounds/woosh.mp3'
	];

	onMount(async () => {
		onResize();

		game = await getGame();

		if (!game) {
			clearStorage();
			goto('/boardGame');
		}

		audioFiles.forEach((path) => {
			let audio = new Audio();
			audio.src = path;
			console.log('audio chargé: ', path);
		});

		//createAudio('/assets/sounds/dungeon.mp3', true, 'dungeon', 0.5);

		socket.emit('isActiveUsers', game.gameId);



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

		socket.on('endGame', (data) => {
			winner = data;
			console.log(data);
		});

		listOfHeroes = await getHeroes();
	});

	socket.on('updateGame', (data) => {
		game = data;
	});

	let closeGame = () => {
		socket.emit('closeGame', game.gameId);
	};

	let openGame = () => {
		socket.emit('openGame', game.gameId);
	};

	let startGame = () => {
		socket.emit('startGame', game.gameId);
		goto(`/boardGame/${game.gameId}`);
	};

	let innerWidth;
	const onResize = () => {
		if (innerWidth < 500) {
			goto('/');
		}
	};
</script>

<div class="container">
	<h1 class="h1">{game.name}</h1>
	<ul class="cardUserList" style="grid-template-columns: repeat({numberOfColGrid}, 1fr);">
		{#if activeUsers.length < 1}
			{#each { length: 6 } as _, index}
				<li class="cardUser-Empty"></li>
			{/each}
		{/if}
		{#each activeUsers as user, index}
			{@const numberOfLi = 6 - activeUsers.length}
			{@const isLast = index === activeUsers.length - 1}
			<li class="cardUser">
				{#if game.statut == 'closed'}
					{#if user.hero}
						<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
						<p class="cardUser_name">{user.hero}</p>
						<p class="cardUser_ability">{user.ability}</p>
						<div class="stats">
							<p class="cardUser_atk">{user.atk} ATK</p>
							<p class="cardUser_atk">{user.def} DEF</p>
						</div>
					{:else}
						<img class="fluidimg userPawn_img" src="/assets/img/nobody.png" alt="pawn icon" />
						<p class="cardUser_ability">
							Vous n'êtes encore personne dans ce monde, un moins que rien!
						</p>
						<div class="stats">
							<p class="cardUser_atk">0 ATK</p>
							<p class="cardUser_atk">0 DEF</p>
						</div>
					{/if}
				{:else}
					<img class="fluidimg userPawn_img" src="/assets/img/nobody.png" alt="pawn icon" />
					<p class="cardUser_name">{user.username}</p>
					<p class="cardUser_ability">
						Vous n'êtes encore personne dans ce monde, un moins que rien!
					</p>
					<div class="stats">
						<p class="cardUser_atk">0 ATK</p>
						<p class="cardUser_atk">0 VIE</p>
					</div>
				{/if}
			</li>
			{#if isLast}
				{#each { length: numberOfLi } as _, index}
					<li class="cardUser-Empty"></li>
				{/each}
			{/if}
		{/each}
	</ul>

	{#if game.statut == 'closed'}
		<button class="btnPrimary js-btn-play" disabled on:click={startGame}>Jouer</button>
		<button class="btnPrimary js-btn-play" on:click={openGame}>ouvrir</button>
	{:else}
		<button class="btnPrimary js-btn-close" disabled on:click={closeGame}>Fermer</button>
	{/if}
</div>
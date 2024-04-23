<script>
	// @ts-nocheck

	import { clearStorage, getGame, getHeroes } from '$lib';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BoardGame from '$lib/composants/BoardGame.svelte';

	export let data;
	const socket = data.socket;

	let game = '';
	let activeUsers = [];
	let listOfHeroes;
	let numberOfColGrid;

	onMount(async () => {
		onResize();

		game = await getGame();

		if (!game) {
			clearStorage();
			goto('/boardGame');
		}

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

			numberOfColGrid = 6;
			if (game.statut == 'closed') {
				numberOfColGrid = activeUsers.length;
			}
		});

		socket.on('endGame', (data) => {
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

<svelte:window on:resize={onResize} bind:innerWidth />

<img class="fluidimg QRCode" src="/assets/img/QR.svg" alt="QRCode" />

{#if game.statut == 'started'}
	{#if activeUsers.length > 0}
		<BoardGame {activeUsers} />
	{/if}
{:else if game.statut == 'ended'}
	<!-- @TODO : winner page -->
	<p>the winner is :</p>
{:else}
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
					<p class="cardUser_name">{user.username}</p>
					{#if game.statut == 'closed'}
						<p class="cardUser_hero">{user.team}</p>
						<p class="cardUser_life">{user.life}</p>
						{#if user.hero}
							<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
							<p class="cardUser_hero">{user.hero}</p>
							<p class="cardUser_atk">{user.atk}</p>
						{:else}
							<p class="cardUser_hero">...</p>
							<p class="cardUser_atk">...</p>
						{/if}
					{/if}
				</li>
				{#if game.statut == 'waiting'}
					{#if isLast}
						{#each { length: numberOfLi } as _, index}
							<li class="cardUser-Empty"></li>
						{/each}
					{/if}
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
{/if}

<button on:click={clearStorage}>Clear</button>

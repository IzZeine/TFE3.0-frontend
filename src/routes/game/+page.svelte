<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getUser } from '$lib';
	import { goto } from '$app/navigation';
	import { clearStorage } from '$lib';

	export let data;
	const socket = data.socket;

	let sessionID = '';
	let user = '';
	let gameID = '';
	let OnlineUsers = 0;
	let activeGames = [];

	onMount(async () => {
		onResize();

		sessionID = sessionStorage.getItem('sessionID');
		console.log(sessionID);
		if (!sessionID) {
			clearStorage();
			throw goto('/')
		}

		gameID = sessionStorage.getItem('gameID');
		if (gameID) {
			throw goto(`/game/${gameID}`)
		}

		socket.on('connect', async () => {
			console.log('Connected to server');
		});

		// Écouter l'événement de réponse du serveur après la création d'utilisateur
		socket.on('userCreated', (id) => {
			console.log(id);
			sessionStorage.setItem('sessionID', id);
		});

		socket.on('updateUsersCount', (count) => {
			OnlineUsers = count;
		});

		user = await getUser(socket);
		if (!user) {
			clearStorage();
			throw goto('/')
		}
	});

	let joinGame = (id) => {
		socket.emit('joinGame', id);
		sessionStorage.setItem('gameID', id);
	};

	let askActiveGames = async () => {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activegames`);
		const activeGamesJson = await response.json();
		activeGames = [...activeGamesJson];
	};

	let displayGames = () => {
		const display = document.querySelector('.activeGames');
		display.classList.add('is-active');
	};

	let hideGames = () => {
		const display = document.querySelector('.activeGames');
		display.classList.remove('is-active');
	};

	let innerWidth;
	const onResize = () => {
		if (screen.width > 500) {
			console.log("enter")
			throw goto('/boardGame');
		}
	};
</script>

<svelte:window on:resize={onResize} bind:innerWidth />

<div class="container">
	<img src="/assets/img/logo.png" class="fluidimg logoImg" alt="Logo" />
	<p>
		Welcome
		{#if user}
			{user.username}
		{/if}
	</p>
	<div class="btnsGames">
		<button
			on:click={(evt) => {
				askActiveGames();
				displayGames(evt);
			}}
			class="btnPrimary"
			>Rejoindre
		</button>
	</div>

	<div class="activeGames">
		<div class="content">
			<div class="btns">
				<button class="btn-menuGames return" on:click={hideGames}
					><img src="/assets/img/return.svg" alt="return" /></button
				>
				<button class="btn-menuGames refresh" on:click={askActiveGames}
					><img src="/assets/img/refresh.svg" alt="refresh" /></button
				>
			</div>
			<ul>
				{#each activeGames as game}
					<li>
						<a href="/game/{game.gameId}">
							<button on:click={joinGame(game.gameId)} class="btn-joinGames">
								<p>{game.name}</p>
								<p class="btn-joinGames_statut">{game.statut} <span>{game.users}/6</span></p>
							</button>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<button on:click={clearStorage}>reset</button>

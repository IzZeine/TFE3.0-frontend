<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import { getUser } from '$lib';
	import { clearStorage } from '$lib';

	const socket = io('http://localhost:3000');

	let sessionID = '';
	let user = '';
	let gameID = '';
	let OnlineUsers = 0;
	let activeGames = [];

	onMount(async () => {
		sessionID = sessionStorage.getItem('sessionID');
		console.log(sessionID);
		if (!sessionID) {
			clearStorage();
			window.location.href = '/';
		}
		gameID = sessionStorage.getItem('gameID');
		if (gameID) {
			window.location.href = '/game/' + gameID;
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

		if (screen.width > 500) {
			window.location.href = '/boardGame';
		}

		user = await getUser(socket);
		if (!user) {
			clearStorage();
			window.location.href = '/';
		}
	});

	let joinGame = (id) => {
		socket.emit('joinGame', id);
		sessionStorage.setItem('gameID', id);
	};

	let askActiveGames = async () => {
		const response = await fetch('http://localhost:3000/activegames');
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
</script>

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
			class="btnPrimary">Rejoindre</button
		>
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

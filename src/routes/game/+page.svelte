<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getMyUrlForDev, getUser } from '$lib';
	import { goto } from '$app/navigation';
	import { clearStorage } from '$lib';
	import { socket } from '$lib/api/socketConnection.js';

	// export let data;
	// const socket = data.socket;

	let sessionID = '';
	let user = '';
	let gameID = '';
	let OnlineUsers = 0;
	let activeGames = [];
	let url = getMyUrlForDev();

	onMount(async () => {
		onResize();

		sessionID = sessionStorage.getItem('sessionID');
		if (!sessionID) {
			clearStorage();
			goto('/');
		}

		gameID = sessionStorage.getItem('gameID');
		if (gameID) {
			goto(`/game/${gameID}`);
		}

		socket.on('updateUsers', async (data) => {
			user = await getUser(socket);
			if(!user) throw goto('/')
		});

		// Écouter l'événement de réponse du serveur après la création d'utilisateur
		socket.on('userCreated', (id) => {
			sessionStorage.setItem('sessionID', id);
		});

		socket.on('updateUsersCount', (count) => {
			OnlineUsers = count;
		});

		user = await getUser(socket);

		if (!user) {
			clearStorage();
			goto('/');
		}

		askActiveGames();
	});

	let joinGame = (id) => {
		socket.emit('joinGame', id);
		sessionStorage.setItem('gameID', id);
	};

	let askActiveGames = async () => {
		const response = await fetch(`${url}/activegames`);
		const activeGamesJson = await response.json();
		activeGames = [...activeGamesJson];
	};

	let innerWidth;
	const onResize = () => {
		if (screen.width > 500) {
			goto('/boardGame');
		}
	};
</script>

<svelte:window on:resize={onResize} bind:innerWidth />

<div class="container">
	<p class="h1" style="display: flex; text-align:center; margin-bottom:24px">
		Rejoindre une partie:
	</p>

	<div class="activeGames">
		<ul>
			{#each activeGames as game}
				<li>
					<a href="/game/{game.gameId}">
						<button on:click={joinGame(game.gameId)} class="btn-joinGames">
							<p>{game.name}</p>
							<p class="btn-joinGames_statut">{game.users}/6</p>
						</button>
					</a>
				</li>
			{/each}
		</ul>
		<button class="btn-menuGames refresh" on:click={askActiveGames}>
			<img src="/assets/img/refresh.svg" alt="refresh" />
		</button>
	</div>
</div>

<!-- <button on:click={clearStorage}>reset</button> -->
<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { getMyUrlForDev } from '$lib';
	import { onMount } from 'svelte';
	import { socket } from '$lib/js/socketConnection.js';
	import QRCode from '$lib/board/QRCode.svelte';

	// export let data;
	// const socket = data.socket;

	let gameID;
	let OnlineUsers = 0;
	let errorMessage = '';
	let gameName = '';
	let url = getMyUrlForDev();
	let activegames = [];

	onMount(async () => {
		onResize();

		gameID = sessionStorage.getItem('gameID');

		if (gameID) {
			goto(`/boardGame/${gameID}`);
		}

		socket.on('connect', async () => {
			console.log('Connected to server');
		});

		socket.on('updateUsersCount', (count) => {
			OnlineUsers = count;
		});
	});

	// disabled btn if the input is empty
	function isDirty(username) {
		return username == '';
	}

	let createGame = async () => {
		const response = await fetch(`${url}/creategame`, {
			// const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/creategame`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: gameName })
		});

		if (response.ok) {
			// Gérer la réponse si nécessaire
			console.log('Game created successfully');
			const gameJson = await response.json();
			gameID = gameJson.gameId;
			sessionStorage.setItem('gameID', gameID);
			goto(`/boardGame/${gameID}`);
		} else {
			console.error('Failed to create game');
			errorMessage = 'Ce nom existe dejà !';
		}
	};

	let askActiveGames = async () => {
		const response = await fetch(`${url}/activegames`);
		console.log(response);
		const activeGamesJson = await response.json();
		console.log(activeGamesJson);
		activegames = [...activeGamesJson];
		console.log(activegames);
	};

	let joinGame = (gameId) => {
		console.log(gameId);
		sessionStorage.setItem('gameID', gameId);
	};

	let innerWidth;
	const onResize = () => {
		console.log(innerWidth);
		if (innerWidth < 500) {
			console.log('enter?');
			goto('/');
		}
	};
</script>

<svelte:window on:resize={onResize} bind:innerWidth />

<QRCode />

<div class="boardgame--home">
	<div class="boardgame--home_content">
		<img src="/assets/img/logo.png" class="fluidimg boardgame--home_logoImg" alt="Logo" />
		<form on:submit|preventDefault={createGame} class="gameNameForm">
			<div class="gameNameForm_content">
				<label for="gameName" class="gameNameLabel">Entrez le nom de votre partie :</label>
				<input
					type="text"
					name="gameName"
					id="gameName"
					class="inputForm"
					placeholder="ex : IzZeine's game"
					maxlength="15"
					size="20"
					autocomplete="off"
					data-lpignore="true"
					data-form-type="other"
					required
					bind:value={gameName}
				/>
				{#if errorMessage}
					<p class="errorCreateGame">{errorMessage}</p>
				{/if}
			</div>
			<button class="btnPrimary btnForm" disabled={isDirty(gameName)}>Jouer</button>
		</form>
	</div>

	<ul>
		{#each activegames as game}
			<li>
				<a href="/boardGame/{game.gameId}">
					<button on:click={() => joinGame(game.gameId)}>
						{game.name}
					</button>
				</a>
			</li>
		{/each}
	</ul>
</div>

<!-- @TODO++ : ajouter des animations quelconques : lancement de combat, récupération d'un item, utilisation de sort -->

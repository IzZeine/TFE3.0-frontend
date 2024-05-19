<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { getMyUrlForDev } from '$lib';
	import { onMount } from 'svelte';
	import { socket } from '$lib/js/socketConnection.js';
	import QRCode from '$lib/board/QRCode.svelte';

	let gameID;
	let errorMessage = '';
	let gameName = '';
	let url = getMyUrlForDev();
	let activegames = [];

	const onConnect = () => {
		console.log('connected');
	};
	const updateUserCount = (count) => {
		console.log('onlineUsers', count);
	};

	onMount(async () => {
		onResize();

		gameID = sessionStorage.getItem('gameID');

		if (gameID) {
			return goto(`/boardGame/${gameID}`);
		}

		socket.on('connect', onConnect);
		socket.on('updateUsersCount', updateUserCount);

		return () => {
			socket.off('connect', onConnect);
			socket.off('updateUsersCount', updateUserCount);
		};
	});

	// disabled btn if the input is empty
	function isDirty(username) {
		return username === '';
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

	let joinGame = (gameId) => {
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

<!-- <audio id="audio" autoplay preload loop>
  <source src="/assets/sounds/dungeon.mp3" type="audio/mpeg">
  Votre navigateur ne prend pas en charge l'élément audio.
</audio> -->

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
		<!-- <button class="btnPrimary btnGamesOnline" on:click={askActiveGames}>Rejoindre</button> -->
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

<!-- <button on:click={()=> clearDataBase(socket)}>Reset dataBase</button> -->

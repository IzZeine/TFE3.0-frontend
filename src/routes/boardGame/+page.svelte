<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import QRCode from '$lib/board/QRCode.svelte';
	export let form;

	let gameID;
	let gameName = '';
	let activegames = [];

	const onConnect = () => {
		console.log('connected');
	};
	const updateUserCount = (count) => {
		console.log('onlineUsers', count);
	};

	onMount(async () => {

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
</script>

<QRCode />

<div class="boardgame--home">
	<div class="boardgame--home_content">
		<img src="/assets/img/logo.png" class="fluidimg boardgame--home_logoImg" alt="Logo" />
		<form method="post" class="gameNameForm">
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
				{#if form?.error}
					<p class="errorCreateGame">{form.message}</p>
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
					{game.name}
				</a>
			</li>
		{/each}
	</ul>
</div>

<!-- <button on:click={()=> clearDataBase(socket)}>Reset dataBase</button> -->

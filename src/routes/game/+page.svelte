<script>
	import { onMount } from 'svelte';
	import { getMyUrlForDev, getUser } from '$lib';
	import { goto } from '$app/navigation';
	import { clearStorage } from '$lib';
	import { socket } from '$lib/api/socketConnection.js';

	let activeGames = [];

	onMount(async () => {
		const sessionID = sessionStorage.getItem('sessionID');
		if (!sessionID) {
			clearStorage();
			goto('/');
		}

		const gameID = sessionStorage.getItem('gameID');
		if (gameID) {
			goto(`/game/${gameID}`);
		}

		const user = await getUser(socket);
		if (!user) {
			clearStorage();
			goto('/');
		}

		await askActiveGames();
	});

	let askActiveGames = async () => {
		const response = await fetch(`${getMyUrlForDev()}/activegames`);
		const activeGamesJson = await response.json();
		activeGames = [...activeGamesJson];
	};
</script>

<div class="container">
	<p class="h1" style="display: flex; text-align:center; margin-bottom:24px">
		Rejoindre une partie:
	</p>

	<div class="activeGames">
		<ul>
			{#each activeGames as game}
				<li>
					<a href="/game/{game.gameId}" class="btn-joinGames">
						<span>{game.name}</span>
						<span class="btn-joinGames_statut">{game.users}/6</span>
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

<script>
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';

	export let data;
	let games = data.games;

	onMount(() => {
		socket.on('updateGames', (data) => {
			console.log('les games : ', data);
			games = data;
		});

		return () => {
			socket.off('updateGames');
		};
	});
</script>

<div class="container">
	<p class="h1" style="display: flex; text-align:center; margin-bottom:24px">
		Rejoindre une partie:
	</p>

	<div class="activeGames">
		<ul>
			{#each games as game}
				<li>
					<a href="/game/{game.gameId}" class="btn-joinGames">
						<span>{game.name}</span>
						<span class="btn-joinGames_statut">{game.users.length}/6</span>
					</a>
				</li>
			{/each}
		</ul>
		<!-- <button class="btn-menuGames refresh" on:click={data.games}>
			<img src="/assets/img/refresh.svg" alt="refresh" />
		</button> -->
	</div>
</div>

<!-- <button on:click={clearStorage}>reset</button> -->

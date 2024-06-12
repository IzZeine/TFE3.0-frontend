<script>
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import { _ } from 'svelte-i18n';

	export let data;
	let games = data.games;

	let updateGames = (data) => {
		console.log('les games : ', data);
		games = data;
	};

	onMount(() => {
		socket.on('updateGames', updateGames);
		return () => {
			socket.off('updateGames', updateGames);
		};
	});
</script>

<div class="container">
	<p class="h1" style="display: flex; text-align:center; margin-bottom:24px">
		{$_('mobile.lobby.join')}:
	</p>

	<div class="activeGames">
		<ul>
			{#each games as game}
				{#if game.statut === 'waiting'}
					<li>
						<a href="/game/{game.gameId}" class="btn-joinGames">
							<span>{game.name}</span>
							<span class="btn-joinGames_statut">{game.users.length}/6</span>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>

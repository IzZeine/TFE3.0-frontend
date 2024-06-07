<script>
	import { clearDataBase } from '$lib/api/clearDataBase.js';
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import { user } from '$lib/api/stores';

	export let game;
	let activeUsers;
	// const winnerTeam = game.winner;
	const winnerTeam = 'hero';
	let winners = [];

	onMount(async () => {
		activeUsers = game.users;
		console.log(game);
		winners = activeUsers.filter((user) => user.team === winnerTeam).map((user) => ({ ...user }));
		console.log(winners);
	});
</script>

<div class="container">
	{#if winnerTeam}
		<div class="endgame">
			<div>
				<h1 class="h1 winner-team">L'equipe : <span>{winnerTeam}</span></h1>
				<h2 class="h2" style:text-align="center">remporte la partie !</h2>
			</div>
			<ul class="winners">
				{#each winners as player}
					<li>
						<img class="fluidimg" src="/assets/img/{player.heroImg}" alt="player" />
					</li>
				{/each}
			</ul>
			<button class="btnPrimary" on:click={() => clearDataBase(socket, game.gameId, $user)}
				>Quitter</button
			>
		</div>
	{/if}
</div>

<style>
	.container {
		height: 100dvh;
		box-sizing: border-box;
	}
</style>

<script>
	import { clearDataBase } from '$lib/api/endGame.js';
	import { resetGame } from '$lib/api/endGame.js';
	import { onMount } from 'svelte';
	import { socket } from '$lib/api/socketConnection.js';
	import { user } from '$lib/api/stores';
	import { _ } from 'svelte-i18n';

	export let game;
	let activeUsers;
	const winnerTeam = game.winner;
	let winners = [];

	onMount(async () => {
		activeUsers = game.users;
		winners = activeUsers.filter((user) => user.team === winnerTeam).map((user) => ({ ...user }));
	});
</script>

<div class="container">
	{#if winnerTeam}
		<div class="endgame">
			<div>
				<h1 class="h1 winner-team">{$_('common.endGame.team')} : <span>{winnerTeam}</span></h1>
				<h2 class="h2" style:text-align="center">{$_('common.endGame.win')}</h2>
			</div>
			<ul class="winners">
				{#each winners as player}
					<li>
						<img class="fluidimg" src="/assets/img/{player.heroImg}" alt="player" />
					</li>
				{/each}
			</ul>
			<div class="footer">
				<button
					class="btnPrimary"
					disabled="true"
					on:click={() => resetGame(socket, game.gameId, $user)}>{$_('common.replay')}</button
				>
				<button class="btnPrimary" on:click={() => clearDataBase(socket, game.gameId, $user)}
					>{$_('common.leave')}</button
				>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		height: 100dvh;
		box-sizing: border-box;
	}
	.endgame {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		.winner-team {
			span {
				position: relative;
			}
			span::before {
				content: '';
				background-image: url('/assets/img/crown.png');
				background-size: contain;
				position: absolute;
				left: 50%;
				width: 30px;
				height: 30px;
				transform: translate(-50%, -75%);
				@media (min-width: 750px) {
					transform: translate(-50%, -50%);
				}
			}
		}
		.winners {
			margin-top: 24px;
			display: grid;
			grid-template-columns: repeat(2, auto);
			@media (min-width: 750px) {
				display: flex;
			}
		}
	}
	.footer {
		display: flex;
		gap: 12px;
	}
</style>

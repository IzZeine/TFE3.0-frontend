<script>
	import { socket } from '$lib/api/socketConnection';
	import { onMount } from 'svelte';

	export let activeUsers, game;
	$: secTurn = 20;

	const onSecTurn = (data) => {
		secTurn = data;
	};
	onMount(() => {
		socket.on('cdTurn', onSecTurn);
	});
</script>

<div class="gameInfos">
	<div class="innerInfos">
		<div class="infos">
			<p class="turns">Tour : {game.round}</p>
			<ul class="players">
				{#each activeUsers as user}
					<li class="player">
						<img src="/assets/img/{user.heroImg}" class="fluidimg --{user.yourTurn}" alt="hero" />
						{#if user.team == 'hero'}
							<ul class="lifes">
								{#each { length: user.life } as life}
									<li><img src="/assets/img/life.png" class="fluidimg" alt="life" /></li>
								{/each}
							</ul>
						{/if}
						{#if user.team == 'boss'}
							<ul class="lifes">
								<!-- <li><img src="/assets/img/life.png" class="fluidimg" alt="life" /></li> -->
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<p class="timerTurn">{secTurn}</p>
</div>

<style lang="scss">
	.gameInfos {
		position: relative;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 1rem;
		overflow: hidden;
	}
	.innerInfos {
		display: flex;
		gap: 24px;
		flex-direction: column;
		height: 100%;
		width: 100%;
		background-color: var(--BG);
		mask-image: radial-gradient(circle at 1.5rem 1.5rem, transparent 1.5rem, gold 0);
		mask-position: -1.5rem -1.5rem;
		mask-repeat: repeat;
	}
	.infos {
		padding: 0.5rem 1rem;
	}
	.turns {
		text-align: center;
	}
	.players {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		.player {
			display: grid;
			grid-template-columns: 0.15fr 1fr;
			align-items: center;
			.--1 {
				transition: 0.2s;
				filter: drop-shadow(0 0 5px var(--primary));
			}
		}
	}
	.lifes {
		display: flex;
		flex-direction: column;
		gap: 6px;
		transform: translate(10px, 0);
	}
	.timerTurn {
		position: absolute;
		z-index: 9;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		margin: 1rem;
		border: solid 1px var(--txtPrimary);
		border-radius: 100%;
		padding: 1rem;
	}
</style>

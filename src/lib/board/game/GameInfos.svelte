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
			<ul class="players">
				{#each activeUsers as user}
					<li class="player --{user.yourTurn}">
						<img src="/assets/img/{user.heroImg}" class="fluidimg" alt="hero" />
						{#if user.life <= 0}
							<img src="/assets/img/death.png" class="fluidimg death" alt="dead" />
						{/if}
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
	<div class="coins timerTurn">
		{#if secTurn >= 10}
			<p class="">00:{secTurn}</p>
		{:else}
			<p class="">00:0{secTurn}</p>
		{/if}
	</div>
	<div class="coins roundCount">
		<p class="">T{game.round}</p>
	</div>
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
			position: relative;
			display: grid;
			grid-template-columns: 0.15fr 1fr;
			align-items: center;
			transition: 0.2s;
			opacity: 0.7;
			filter: grayscale(0.8);
			img {
				transition: 0.2s;
			}
		}
		.player.--1 {
			opacity: 1;
			filter: grayscale(0);
			img {
				filter: drop-shadow(0 0 5px var(--primary));
			}
		}
		.death {
			position: absolute;
		}
	}
	.lifes {
		display: flex;
		flex-direction: column;
		gap: 6px;
		transform: translate(10px, 0);
	}
	.coins {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 60px;
		z-index: 9;
		top: 0;
		margin: 1rem;
		border: solid 1px var(--txtPrimary);
		border-radius: 100%;
		background-color: #0b0b0b;
	}
	.timerTurn {
		left: 0;
		transform: translate(-50%, -50%);
	}
	.roundCount {
		right: 0;
		transform: translate(50%, -50%);
	}
</style>

<script>
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';

	export let activeUsers;
	let boss, heroes, battle, rows, columns;

	boss = {
		heroImg: 'dragon.png'
	};
	heroes = [
		{
			heroImg: 'knight.png'
		},
		{
			heroImg: 'knight.png'
		}
	];

	if (heroes.length > 3) {
		rows = 3;
		columns = 2;
	}

	const onBattle = (data) => {
		battle = true;
		boss = activeUsers.find((user) => user.room === data && user.team == 'boss');

		heroes = activeUsers
			.filter((user) => user.room === data && user.team == 'hero')
			.map((user) => ({ ...user }));
	};
	const onBattleEnd = (data) => {
		battle = false;
		const { winner } = data;
	};
	onMount(() => {
		socket.on('battle', onBattle);
		socket.on('endedBattle', onBattleEnd);
		return () => {
			socket.off('battle', onBattle);
			socket.off('endedBattle', onBattleEnd);
		};
	});
</script>

{#if battle}
	<div class="battle" in:blur={{ y: 50, duration: 500 }} out:blur={{ duration: 500 }}>
		<div class="boss">
			<img src="/assets/img/big{boss.heroImg}" alt="boss" class="bossImg fluidimg" />
			<img src="/assets/img/crown.png" class="fluidimg crown" alt="crown" />
		</div>
		<ul
			class="heroes"
			style:grid-template-rows="repeat({rows},1fr)"
			style:grid-template-columns="repeat({columns},1fr)"
		>
			{#each heroes as hero}
				<li class="hero">
					<img src="/assets/img/{hero.heroImg}" alt="hero" class="hero-img fluidimg" />
				</li>
			{/each}
		</ul>
		<img src="/assets/img/vs.png" alt="vs" class="vs fluidimg" />
	</div>
{/if}

<style lang="scss">
	.battle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 50%;
		width: 50%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		align-items: center;
		.heroes {
			height: 100%;
			margin-left: 15%;
			display: grid;

			.hero {
				opacity: 0;
				animation: battleHero 4s;
				position: relative;
				height: 100%;
			}
			.hero-img {
				position: absolute;
				top: 50%;
				transform: translate(0, -50%);
				max-height: 100%;
			}
		}
		.vs {
			position: absolute;
			max-height: 100%;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 0;
			animation: battleVs 4s;
		}
	}

	.boss {
		opacity: 0;
		animation: battleBoss 4s;
	}
	.crown {
		opacity: 0;
		animation: battleCrown 4s;
		z-index: -1;
		position: absolute;
		max-width: 50%;
		top: 25%;
		left: 50%;
		transform: translate(-50%, 0);
	}

	@keyframes battleBoss {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 1;
			transform: translate(0, 0) scale(1);
		}
		100% {
			opacity: 1;
			transform: translate(50%, 0) scale(2);
		}
	}
	@keyframes battleCrown {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
			top: 25%;
		}
		100% {
			opacity: 1;
			top: -25%;
		}
	}
	@keyframes battleHero {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0);
		}
	}
	@keyframes battleVs {
		0% {
			opacity: 1;
		}
		45% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		80% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		100% {
			transform: translate(-50%, -50%) scale(0);
		}
	}
</style>

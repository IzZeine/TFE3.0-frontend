<script>
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';

	export let activeUsers;
	let boss, heroes, battle;

	boss = {
		heroImg: 'dragon.png'
	};
	heroes = [
		{
			heroImg: 'knight.png'
		},
		{
			heroImg: 'knight.png'
		},
		{
			heroImg: 'knight.png'
		},
		{
			heroImg: 'knight.png'
		},
		{
			heroImg: 'knight.png'
		}
	];

	const onBattle = (data) => {
		battle = true;
		boss = activeUsers.find((user) => user.room === data && user.team == 'boss');

		heroes = activeUsers
			.filter((user) => user.room === data && user.team == 'hero')
			.map((user) => ({ ...user }));
		console.log(data);
		console.log(boss);
		console.log(heroes);

		// throttledAnimBattle('battle');
	};
	const onBattleEnd = (data) => {
		battle = false;
		const { winner } = data;
		console.log(winner);
		// throttledAnimBattleEnd(winner);
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
		<img src="/assets/img/big{boss.heroImg}" alt="boss" class="boss fluidimg" />
		<ul class="heroes">
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
		top: 0;
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		align-items: center;
		.heroes {
			height: 100%;
			display: flex;
			// flex-direction: column;
			align-items: center;
			gap: 6px;
			.hero {
				// background-color: red;
			}
			.hero-img {
				// background-color: pink;
				max-height: 100%;
				width: auto;
			}
		}
		.vs {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>

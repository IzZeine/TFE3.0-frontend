<script>
	import { user } from '$lib/api/stores';
	import { socket } from '$lib/api/socketConnection.js';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let activeUsers;
	let boss, heroes, battle, def, atk;

	const onBattle = (data) => {
		if (activeUsers.find((player) => player.room != $user.room)) return;
		battle = true;
		boss = activeUsers.find((user) => user.room === data && user.team == 'boss');
		def = boss.def;

		heroes = activeUsers
			.filter((user) => user.room === data && user.team == 'hero')
			.map((user) => ({ ...user }));

		atk = 0;
		heroes.forEach((hero) => {
			console.log(hero.atk);
			atk += hero.atk;
			console.log(atk);
		});
	};

	const onBattleEnd = (data) => {
		battle = false;
		const { winner } = data;
		console.log(winner);
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
	<div class="dialog dialog_battle">
		<div class="headerDialog">
			<img class="fluidimg" src="/assets/img/{boss.heroImg}" alt="boss" />
			<p class="h1 dialog_battle-boss" style="--color:{boss.color};">{boss.hero}</p>
			<ul class="heroes">
				{#each heroes as hero}
					<li>
						<img class="fluidimg hero" src="/assets/img/{hero.heroImg}" alt="hero" />
					</li>
				{/each}
			</ul>
		</div>
		<div class="contentDialog">
			<div class="right">
				<p class="h2">{$_('mobile.map.battle.boss')}</p>
				<p>{def} {$_('common.characters.def')}</p>
			</div>
			<div class="left">
				<p class="h2">{$_('mobile.map.battle.heroes')}</p>
				<p>{atk} {$_('common.characters.atk')}</p>
			</div>
		</div>
		<div class="footerDialog">
			<p>{$_('mobile.map.battle.youFight')}</p>
		</div>
	</div>
{/if}

<style lang="scss">
	.dialog_battle-boss {
		color: var(--color);
	}
	.dialog_battle {
		display: flex;
		flex-direction: column;
		gap: 12px;
		.heroes {
			display: flex;
			justify-content: center;
			margin-top: 12px;
			.hero {
				max-width: calc((100vw) / 5);
			}
		}
		.contentDialog {
			display: flex;
			justify-content: center;
			gap: 24px;
			.left {
				text-align: start;
			}
			.right {
				text-align: end;
			}
		}
		.footerDialog {
			margin-top: auto;
			text-align: center;
		}
	}
</style>

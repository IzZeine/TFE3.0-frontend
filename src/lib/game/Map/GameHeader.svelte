<script>
	import { user } from '$lib/api/stores';
	import { _ } from 'svelte-i18n';
	$: currentUser = $user;
</script>

<div class="headerMap">
	<div class="cardHero">
		<div class="lifes">
			{#if $user.team === 'hero'}
				<ul class="cardHero_stats-life">
					{#each { length: currentUser.life } as _, index}
						{@const numberOfLife = currentUser.life}
						{@const isLast = index === currentUser.life - 1}
						<li>
							<img class="fluidimg" src="/assets/img/life.svg" alt="life" />
						</li>
						{#if isLast}
							{#each { length: 3 - numberOfLife } as _, index}
								<li>
									<img class="fluidimg" src="/assets/img/noLife.svg" alt="life" />
								</li>
							{/each}
						{/if}
					{/each}
					{#if currentUser.life <= 0}
						{#each { length: 3 } as _}
							<li>
								<img class="fluidimg" src="/assets/img/noLife.svg" alt="life" />
							</li>
						{/each}
					{/if}
				</ul>
			{:else}
				<ul class="cardHero_stats-life">
					<li>
						<img class="fluidimg" src="/assets/img/life.svg" alt="life" />
					</li>
				</ul>
			{/if}
		</div>
		{#if currentUser.life <= 0}
			<img
				class="fluidimg cardHero_img --hero"
				src="/assets/img/{currentUser.heroImg}"
				alt="pawn icon"
			/>
			<img class="fluidimg cardHero_img --death" src="/assets/img/death.png" alt="death" />
		{:else}
			<img class="fluidimg cardHero_img" src="/assets/img/{currentUser.heroImg}" alt="pawn icon" />
		{/if}
		<div class="cardHero_stats">
			<ul class="actions">
				{#each { length: currentUser.pa } as pa}
					<li class="pa">
						<img src="/assets/img/pa.png" class="fluidimg pa" alt="pa" />
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<p class="cardHero_hero" style="--color:{currentUser.color};">
		{currentUser.hero}
	</p>
	<div class="cardHero_stats-atk-def">
		<div class="cardHero_stats-atk-def_atk">
			<p><span>{currentUser.atk}</span> {$_('common.characters.atk')}</p>
		</div>
		<div class="cardHero_stats-atk-def_def">
			<p><span>{currentUser.def}</span> {$_('common.characters.def')}</p>
		</div>
	</div>
</div>

<style lang="scss">
	.actions {
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: 6px;
		.pa {
			max-width: 18px;
		}
	}
	.cardHero_stats-atk-def {
		display: flex;
		gap: 12px;
		justify-content: center;
	}
	.cardHero_hero {
		color: var(--color);
		position: relative;
		width: fit-content;
		margin: 0 auto;
	}
	.cardHero_hero::after,
	.cardHero_hero::before {
		content: '';
		position: absolute;
		top: 50%;
		flex-direction: row;
		background-color: var(--color);
		height: 2px;
		width: 30px;
	}
	.cardHero_hero::before {
		transform: translate(-100%, 0);
		left: -12px;
	}
</style>

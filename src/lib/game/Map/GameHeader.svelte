<script>
	export let user;
	let color = user.color;
</script>

<div class="headerMap">
	<div class="cardHero">
		<div class="lifes">
			<ul class="cardHero_stats-life">
				{#each { length: user.life } as _, index}
					{@const numberOfLife = user.life}
					{@const isLast = index === user.life - 1}
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
				{#if user.life <= 0}
					{#each { length: 3 } as _}
						<li>
							<img class="fluidimg" src="/assets/img/noLife.svg" alt="life" />
						</li>
					{/each}
				{/if}
			</ul>
		</div>
		{#if user.life <= 0}
			<img class="fluidimg cardHero_img --hero" src="/assets/img/{user.heroImg}" alt="pawn icon" />
			<img class="fluidimg cardHero_img --death" src="/assets/img/death.png" alt="death" />
		{:else}
			<img class="fluidimg cardHero_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
		{/if}
		<div class="cardHero_stats">
			<div class="cardHero_stats-atk-def">
				<div class="cardHero_stats-atk-def_atk">
					<p>ATK: <span>{user.atk}</span></p>
				</div>
				<div class="cardHero_stats-atk-def_def">
					<p>DEF: <span>{user.def}</span></p>
				</div>
			</div>
		</div>
	</div>
	<p class="cardHero_hero" style="--color:{color};">{user.hero}</p>
</div>

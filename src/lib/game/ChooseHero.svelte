<script>
	import { createEventDispatcher } from 'svelte';
	import Carousel from 'svelte-carousel';
	import { user } from '$lib/api/stores';

	const dispatch = createEventDispatcher();

	export let heroes, boss;
	let selectedHero;

	$: {
		if ($user.team && !selectedHero) {
			if ($user.team === 'hero') {
				selectedHero = heroes[0];
			}
			if ($user.team === 'boss') {
				selectedHero = boss[0];
			}
		}
	}

	function chooseHero() {
		console.log(selectedHero);
		dispatch('ChooseHero', {
			hero: selectedHero
		});
	}

	let carousel; // for calling methods of the carousel instance
	const handleNextClick = () => {
		carousel.goToNext();
	};
	const handlePrevClick = () => {
		carousel.goToPrev();
	};
</script>

<div class="chooseHero">
	{#if $user.team === 'hero'}
		<h1 class="h1">Tu es un hero !</h1>
	{/if}
	{#if $user.team === 'boss'}
		<h1 class="h1">Tu es le boss !</h1>
	{/if}
	<h2 class="h2">Lequel choisis-tu ?</h2>
	{#if heroes && boss && $user.team}
		<Carousel
			bind:this={carousel}
			on:pageChange={(event) => {
				if ($user.team === 'hero') {
					selectedHero = heroes[event.detail];
				}
				if ($user.team === 'boss') {
					selectedHero = boss[event.detail];
				}
			}}
		>
			{#if $user.team === 'hero'}
				{#each heroes as hero}
					<div class="heroItem">
						<img class="fluidimg heroImg" src="/assets/img/{hero.img}" alt={hero.name} />
					</div>
				{/each}
			{/if}

			{#if $user.team == 'boss'}
				{#each boss as oneBoss}
					<div class="heroItem">
						<img class="fluidimg heroImg" src="/assets/img/{oneBoss.img}" alt={oneBoss.name} />
					</div>
				{/each}
			{/if}

			<div class="arrowNavigate" slot="prev">
				<button on:click={handlePrevClick}
					><img
						src="/assets/img/arrow.svg"
						alt="prev"
						class="fluidimg arrowNavigate-item prev"
					/></button
				>
			</div>
			<div class="arrowNavigate" slot="next">
				<button on:click={handleNextClick}
					><img
						src="/assets/img/arrow.svg"
						alt="prev"
						class="fluidimg arrowNavigate-item next"
						style="transform: scale(-1);"
					/></button
				>
			</div>
			<div slot="dots">
				<!--delete dots-->
			</div>
		</Carousel>
	{/if}

	{#if selectedHero}
		<p class="h1" style="color: {selectedHero.color};">{selectedHero.name}</p>
		<p class="stats">
			<span>DEF:</span>
			{selectedHero.baseLife}
			<span>ATK:</span>
			{selectedHero.baseAtk}
		</p>
		<p class="abilityTitle">{selectedHero.abilityName}</p>
		<p class="heroDescription">{selectedHero.ability}</p>
	{/if}

	<div class="footer">
		<button on:click={chooseHero} class="btnPrimary">Choisir</button>
		<p style:margin-top="12px">
			Personnage actuel :
			{#if $user.hero}
				{$user.hero}
			{:else}
				...
			{/if}
		</p>
	</div>
</div>

<style lang="scss">
	.chooseHero {
		box-sizing: border-box;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30px;
	}

	.stats {
		span {
			font-weight: 400;
		}
	}

	.heroImg {
		width: 300px;
	}
	.arrowNavigate {
		display: flex;
	}

	.arrowNavigate > button {
		background-color: unset;
	}
	.arrowNavigate-item {
		width: 24px;
	}
	.abilityTitle {
		font-family: 'Source Serif 4', serif;
		font-weight: 400;
		margin-top: 12px;
	}
	.heroDescription {
		text-align: center;
		margin: 12px 0;
	}
	.footer {
		margin-top: auto;
		button {
			display: block;
			margin: 0 auto;
		}
	}
</style>

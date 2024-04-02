<script>
	// @ts-nocheck
	import { createEventDispatcher, onMount } from 'svelte';
	import Carousel from 'svelte-carousel';
	import { getHeroes, getBoss } from '$lib';

	export let user = user;
	let heroes = '';
	let boss = '';
	let selectedHero = '';

	onMount(async () => {
		heroes = await getHeroes(); // get Json
		heroes = Object.values(heroes); // change Json to array
		boss = await getBoss(); // get Json
		boss = Object.values(boss); // change Json to array

		if (user.team) {
			if (user.team == 'hero') {
				selectedHero = heroes[0];
			}
			if (user.team == 'boss') {
				selectedHero = boss[0];
			}
		}
	});

	const dispatch = createEventDispatcher();

	function chooseHero() {
		dispatch('ChooseHero', {
			hero: selectedHero
		});
		console.log(selectedHero);
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
	{#if user.team == 'hero'}
		<h1 class="h1">Tu es un hero !</h1>
	{/if}
	{#if user.team == 'boss'}
		<h1 class="h1">Tu es le boss !</h1>
	{/if}
	<h2 class="h2">Lequel choisis-tu ?</h2>
	{#if heroes && boss && user.team}
		<Carousel
			bind:this={carousel}
			on:pageChange={(event) => {
				if (user.team == 'hero') {
					selectedHero = heroes[event.detail];
				}
				if (user.team == 'boss') {
					selectedHero = boss[event.detail];
				}
			}}
		>
			{#if user.team == 'hero'}
				{#each heroes as hero}
					<div class="heroItem">
						<img class="fluidimg heroImg" src="/assets/img/{hero.img}" alt={hero.name} />
					</div>
				{/each}
			{/if}

			{#if user.team == 'boss'}
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

	{#if user.team == 'hero'}
		<p class="h1" style="color: {selectedHero.color};">{selectedHero.name}</p>
		<p class="abilityTitle">Habilité :</p>
		<p class="heroDescription">{selectedHero.ability}</p>
	{/if}

	{#if user.team == 'boss'}
		<!-- content here -->
		<p class="h1" style="color: {selectedHero.color};">{selectedHero.name}</p>
		<p class="abilityTitle">Habilité :</p>
		<p class="heroDescription">{selectedHero.ability}</p>
	{/if}

	<button on:click={chooseHero} class="btnPrimary">Choose</button>
</div>

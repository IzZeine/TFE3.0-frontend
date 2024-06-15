<script>
	import Dialog from '../Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	import { user } from '$lib/api/stores';

	export let currentDialog, game;

	const dispatch = createEventDispatcher();

	function useAbility(data) {
		dispatch('useAbility', data);
	}
</script>

<Dialog {user} {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
		<ul class="userChoice">
			{#each game.users as user}
				{#if user.life <= 0}
					<li class="userChoice_item">
						<button class="userChoice_item-btn" on:click={() => useAbility(user)}>
							<img class="fluidimg hero" src="/assets/img/{user.heroImg}" alt="heroDead" />
						</button>
						<p class="userChoice_item-username">{user.username}</p>
					</li>
				{/if}
			{/each}
		</ul>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<p class="h2">{$user.abilityName}</p>
		<p>{$user.ability}</p>
		<div class="cost">
			<p>-2</p>
			<img src="/assets/img/pa.png" class="fluidImg pa" alt="pa" />
		</div>
	</svelte:fragment>
</Dialog>

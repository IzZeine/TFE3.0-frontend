<script>
	import Dialog from '../Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	import { user } from '$lib/api/stores';

	export let currentDialog;

	const dispatch = createEventDispatcher();

	function useAbility(data) {
		dispatch('useAbility');
	}
</script>

<Dialog {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<p class="h2">{$user.abilityName}</p>
		<p>{$user.ability}</p>
	</svelte:fragment>
</Dialog>

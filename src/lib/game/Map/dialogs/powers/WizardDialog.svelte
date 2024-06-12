<script>
	import Dialog from '../Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	import { user } from '$lib/api/stores';
	import { _ } from 'svelte-i18n';

	export let currentDialog;

	const dispatch = createEventDispatcher();

	function useAbility(data) {
		dispatch('useAbility');
	}
</script>

<!-- l'event closeDialog est forwardé vers le composant GameDialogs https://learn.svelte.dev/tutorial/event-forwarding -->
<Dialog {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<p class="h2">{$user.abilityName}</p>
		<p>{$user.ability}</p>
		<div class="cost">
			<p>-2</p>
			<img src="/assets/img/pa.png" class="fluidImg pa" alt="pa" />
		</div>
		<button class="btnPrimary" on:click={useAbility}>{$_('mobile.map.power.use')}</button>
	</svelte:fragment>
</Dialog>

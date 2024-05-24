<script>
	import Dialog from '../Dialog.svelte';
	import { createEventDispatcher } from 'svelte';

	export let user = user;
	export let currentDialog;

	const dispatch = createEventDispatcher();

	function useAbility(data) {
		dispatch('useAbility');
	}
</script>

<!-- l'event closeDialog est forwardé vers le composant GameDialogs https://learn.svelte.dev/tutorial/event-forwarding -->
<Dialog {user} {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<p class="h2">{user.abilityName}</p>
		<p>{user.ability}</p>
		<button class="btnPrimary" on:click={useAbility}>Utiliser</button>
	</svelte:fragment>
</Dialog>

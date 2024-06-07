<script>
	import Dialog from '../Dialog.svelte';
	import { user } from '$lib/api/stores';
	export let currentDialog;
</script>

<!-- l'event closeDialog est forwardé vers le composant GameDialogs https://learn.svelte.dev/tutorial/event-forwarding -->
<Dialog {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<p class="h2">{$user.abilityName}</p>
		<p>{$user.ability}</p>
	</svelte:fragment>
</Dialog>

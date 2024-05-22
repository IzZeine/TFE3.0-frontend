<script>
	//@ts-nocheck
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}

	export let user = user;
</script>

<dialog class="dialog dialog_inventory">
	<div class="headerDialog">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
		<slot name="header" />
	</div>
	<div class="contentDialog">
		<p class="h2">{user.abilityName}</p>
		<p>{user.ability}</p>
		<slot name="footer" />
	</div>
	<div class="footerDialog">
		<div class="actionButtons">
			<button class="actionButton" on:click={closeDialog}>
				<img class="fluidimg" src="/assets/img/leave.svg" alt="Ax" />
			</button>
		</div>
	</div>
</dialog>

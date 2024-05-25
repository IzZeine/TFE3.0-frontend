<script>
	import { fade, fly, blur, slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let currentDialog;

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{#if currentDialog}
	<dialog
		class="dialog dialog_{currentDialog}"
		open
		in:blur={{ y: 50, duration: 5 }}
		out:blur={{ duration: 5 }}
	>
		<div class="headerDialog">
			<slot name="header" />
		</div>
		<div class="contentDialog">
			<slot name="content" />
		</div>
		<div class="footerDialog">
			<div class="actionButtons">
				<button class="actionButton" on:click={closeDialog}>
					<img class="fluidimg" src="/assets/img/leave.svg" alt="leave" />
				</button>
				<slot name="footer" />
			</div>
		</div>
	</dialog>
{/if}

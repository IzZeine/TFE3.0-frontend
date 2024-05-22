<script>
	import Dialog from './Dialog.svelte';
	import { createEventDispatcher } from 'svelte';

	export let user = user;
	export let currentDialog;

	const dispatch = createEventDispatcher();

	let getnumber = () => {
		let numbers = [];
		while (numbers.length < 5) {
			var r = Math.floor(Math.random() * 38) + 1;
			while (r == 19) {
				r = Math.floor(Math.random() * 38) + 1;
			}
			if (numbers.indexOf(r) === -1) numbers.push(r);
		}
		return numbers;
	};

	function useAbility(data) {
		dispatch('useAbility');
	}

	let randomRoomTP = getnumber();
</script>

<!-- l'event closeDialog est forwardé vers le composant GameDialogs https://learn.svelte.dev/tutorial/event-forwarding -->
<Dialog {user} {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<ul class="roomChoice">
			{#each randomRoomTP as room}
				<li class="roomChoice_item">
					<button class="roomChoice_item-btn" on:click={() => useAbility(room)}>{room}</button>
				</li>
			{/each}
		</ul>
	</svelte:fragment>
</Dialog>

<script>
	//@ts-nocheck
	import Dialog from './Dialog.svelte';

	export let user = user;

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

	let randomRoomTP = getnumber();
</script>

<!-- l'event closeDialog est forwardé vers le composant GameDialogs https://learn.svelte.dev/tutorial/event-forwarding -->
<Dialog {user} on:closeDialog>
	<svelte:fragment name="header">
		<ul class="roomChoice">
			{#each randomRoomTP as room}
				<li class="roomChoice_item">
					<button class="roomChoice_item-btn" on:click={() => useAbility(room)}>{room}</button>
				</li>
			{/each}
		</ul>
	</svelte:fragment>
	<svelte:fragment name="footer">
		coucou le footer
	</svelte:fragment>
</Dialog>

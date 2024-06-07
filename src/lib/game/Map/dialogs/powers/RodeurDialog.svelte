<script>
	import Dialog from '../Dialog.svelte';
	import { createEventDispatcher } from 'svelte';
	import { user } from '$lib/api/stores';

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
		dispatch('useAbility', data);
	}

	let randomRoomTP = getnumber();
</script>

<!-- l'event closeDialog est forwardé vers le composant GameDialogs https://learn.svelte.dev/tutorial/event-forwarding -->
<Dialog {currentDialog} on:closeDialog>
	<svelte:fragment slot="header">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
		<ul class="roomChoice">
			{#each randomRoomTP as room}
				<li class="roomChoice_item">
					<button
						class="roomChoice_item-btn"
						on:click={() => {
							useAbility(room);
						}}>{room}</button
					>
				</li>
			{/each}
		</ul>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<p class="h2">{$user.abilityName}</p>
		<p>{$user.ability}</p>
	</svelte:fragment>
</Dialog>

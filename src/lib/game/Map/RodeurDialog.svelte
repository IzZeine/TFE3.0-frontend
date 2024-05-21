<script>
	import Dialog from './Dialog.svelte';
</script>

<Dialog active={dialogActive == 'dialog_power'}>
	<div class="headerDialog">
		<img class="fluidimg" src="/assets/img/boardgame.png" alt="plateau" />
		<ul class="roomChoice">
			{#each randomRoomTP as room}
				<li class="roomChoice_item">
					<button class="roomChoice_item-btn" on:click={() => useAbility(room)}>{room}</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="contentDialog">
		<p class="h2">{user.abilityName}</p>
		<p>{user.ability}</p>
		<!-- <button class="btnPrimary" on:click={useAbility}>Utiliser</button> -->
	</div>
</Dialog>

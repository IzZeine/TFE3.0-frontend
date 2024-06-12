<script>
	export let game;
	export let user;
	import { _ } from 'svelte-i18n';
</script>

<div class="cardUser">
	{#if game.statut == 'closed'}
		{#if user.hero}
			<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
			<p class="cardUser_name">{user.hero}</p>
			<p class="cardUser_ability">{user.ability}</p>
			<div class="stats">
				<p class="cardUser_atk">{user.atk} {$_('common.characters.atk')}</p>
				<p class="cardUser_atk">{user.def} {$_('common.characters.def')}</p>
			</div>
		{:else}
			<img class="fluidimg userPawn_img" src="/assets/img/nobody.png" alt="pawn icon" />
			<p class="cardUser_ability">{$_('desktop.lobby.characters.nobodyPower')}</p>
			<div class="stats">
				<p class="cardUser_atk">0 {$_('common.characters.atk')}</p>
				<p class="cardUser_atk">0 {$_('common.characters.def')}</p>
			</div>
		{/if}
	{:else}
		<img class="fluidimg userPawn_img" src="/assets/img/nobody.png" alt="pawn icon" />
		<p class="cardUser_name">{user.username}</p>
		<p class="cardUser_ability">{$_('desktop.lobby.characters.nobodyPower')}</p>
		<div class="stats">
			<p class="cardUser_atk">0 {$_('common.characters.atk')}</p>
			<p class="cardUser_atk">0 {$_('common.characters.def')}</p>
		</div>
	{/if}
</div>

<script>
	export let game;
	export let user;
</script>

<div class="cardUser">
	{#if game.statut == 'closed'}
		{#if user.hero}
			<img class="fluidimg userPawn_img" src="/assets/img/{user.heroImg}" alt="pawn icon" />
			<p class="cardUser_name">{user.hero}</p>
			<p class="cardUser_ability">{user.ability}</p>
			<div class="stats">
				<p class="cardUser_atk">{user.atk} ATK</p>
				<p class="cardUser_atk">{user.def} DEF</p>
			</div>
		{:else}
			<img class="fluidimg userPawn_img" src="/assets/img/nobody.png" alt="pawn icon" />
			<p class="cardUser_ability">Vous n'êtes encore personne dans ce monde, un moins que rien!</p>
			<div class="stats">
				<p class="cardUser_atk">0 ATK</p>
				<p class="cardUser_atk">0 DEF</p>
			</div>
		{/if}
	{:else}
		<img class="fluidimg userPawn_img" src="/assets/img/nobody.png" alt="pawn icon" />
		<p class="cardUser_name">{user.username}</p>
		<p class="cardUser_ability">Vous n'êtes encore personne dans ce monde, un moins que rien!</p>
		<div class="stats">
			<p class="cardUser_atk">0 ATK</p>
			<p class="cardUser_atk">0 VIE</p>
		</div>
	{/if}
</div>

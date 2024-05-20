<script>
	// @ts-nocheck
	let rulesPage = 1;

	function increment() {
		rulesPage++;
	}
	function deincrement() {
		rulesPage--;
	}
</script>

<div class="howToPlay">
	<h1 class="h1">Comment jouer ?</h1>
	<div class="howToPlay-content">
		<h2 class="h2">Phase {rulesPage}</h2>
		{#if rulesPage == 1}
			<p class="h2">Mise en place du jeu :</p>
		{/if}
		{#if rulesPage == 2}
			<p class="h2">Exploration du donjon :</p>
		{/if}
		{#if rulesPage == 3}
			<p class="h2">Fin du jeu :</p>
		{/if}

		<ul class="rulesList">
			{#if rulesPage == 1}
				<li class="rulesItem">Chaque joueur se connecte au jeu grâce au QR code sur le plateau.</li>
				<li class="rulesItem">
					Un joueur aléatoire est désigné comme méchant et peut choisir le boss qu'il va incarner.
				</li>
				<li class="rulesItem">
					Les autres joueurs peuvent choisir le héros qu'ils vont jouer durant la partie.
				</li>
			{/if}
			{#if rulesPage == 2}
				<li class="rulesItem">
					Tous les héros ainsi que le boss peuvent se déplacer case par case dans le donjon.
				</li>
				<li class="rulesItem">Chaque salle possède un item.</li>
				<li class="rulesItem">
					Pour récupérer les items les héros devront lancer des dés en remplissant certaines
					conditions.
				</li>
				<li class="rulesItem">
					Si le boss arrive dans la même salle qu'un ou plusieurs héros, un combat se lance. A la
					fin de celui-ci, tout le monde retourne à son spawn.
				</li>
			{/if}
			{#if rulesPage == 3}
				<li class="rulesItem">Le boss gagne s'il arrive à tuer 3 fois chaque joueur.</li>
				<li class="rulesItem">Les héros gagnent s'il parviennent à tuer une fois le boss</li>
			{/if}
		</ul>
	</div>
	<div class="btnRules">
		<img src="/assets/img/gamerules{rulesPage}.png" class="dotsRules" alt="dots" />
		<button on:click={deincrement} disabled={rulesPage === 1} class="btnPrimary">prev</button>
		<button on:click={increment} disabled={rulesPage === 3} class="btnPrimary">next</button>
	</div>
</div>

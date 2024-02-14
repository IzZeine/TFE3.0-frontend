<script>
    // @ts-nocheck
    let rulesPage = 1;

    function increment (){
        rulesPage ++;
    }
    function deincrement (){
        rulesPage --;
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
                <li class="rulesItem">Un joueur aléatoire est désigné comme méchant et peut choisir le boss qu'il va incarner.</li>
                <li class="rulesItem">Les autres joueurs peuvent choisir le héros qu'ils vont jouer durant la partie.</li>
            {/if}
            {#if rulesPage == 2}
                <li class="rulesItem">Tous les héros ainsi que le boss peuvent se déplacer case par case (case voisine) dans le donjon. </li>
                <li class="rulesItem">Chaque salle possède un item.</li>
                <li class="rulesItem">Pour pouvoir accéder aux salles les joueurs devront combattre des monstres.</li>
                <li class="rulesItem">Si un joueur est déjà en combat dans la salle, personne ne peut rejoindre ni lancer un nouveau combat dans la même salle. Il ne feront alors que traverser la salle sans pouvoir y récupérer un item.</li>
                <li class="rulesItem">Le boss se déplace également dans le donjon.  Il bats également des monstres et récolte également des items. Il essaye de rejoindre les joueurs afin de les tuer.</li>
                <li class="rulesItem">Si un héro meurt, il perd une vie (il en a trois).</li>
                <li class="rulesItem">Quand le boss tue quelqu'un, une zone rouge apparait sur un diamètre de 4 salles dans une desquelles il se trouve.</li>
                <li class="rulesItem">Si un héros trouve la clef du donjon, il pourra se rendre dans la salle des coffres ou il pourra récolter des objets plus puissants.</li>
            {/if}
            {#if rulesPage == 3}
                <li class="rulesItem">Le boss gagne s'il a réussi à tuer tous les héro 3 fois.</li>
                <li class="rulesItem">Les héros gagnent s'ils arrivent à se coordonner afin de le tuer.</li>
            {/if}
        </ul>

    </div>
    <p class="pageRules">{rulesPage}/3</p>
    <div class="btnRules">
        <button on:click={deincrement} disabled={rulesPage===1} class="btnPrimary">Précédent</button>
        <button on:click={increment} disabled={rulesPage===3} class="btnPrimary">Suivant</button>
    </div>
</div>
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

<div>
    <h1>Comment jouer ?</h1>
    <!-- change composant -->
        <div>
            <h2>Phase {rulesPage}</h2>
            {#if rulesPage == 1}
                <p>Mise en place du jeu :</p>
            {/if}
            {#if rulesPage == 2}
                <p>Exploration du donjon :</p>
            {/if}
            {#if rulesPage == 3}
                <p>Fin du jeu :</p>
            {/if}
            <div>
                <ul>
                    {#if rulesPage == 1}
                        <li>Chaque joueur se connecte au jeu grâce au QR code sur le plateau.</li>
                        <li>Un joueur aléatoire est désigné comme méchant et peut choisir le boss qu'il va incarner.</li>
                        <li>Les autres joueurs peuvent choisir le héros qu'ils vont jouer durant la partie.</li>
                    {/if}
                    {#if rulesPage == 2}
                        <li>Tous les héros ainsi que le boss peuvent se déplacer case par case (case voisine) dans le donjon. </li>
                        <li>Chaque salle possède un item.</li>
                        <li>Pour pouvoir accéder aux salles les joueurs devront combattre des monstres.</li>
                        <li>Si un joueur est déjà en combat dans la salle, personne ne peut rejoindre ni lancer un nouveau combat dans la même salle. Il ne feront alors que traverser la salle sans pouvoir y récupérer un item.</li>
                        <li>Le boss se déplace également dans le donjon.  Il bats également des monstres et récolte également des items. Il essaye de rejoindre les joueurs afin de les tuer.</li>
                        <li>Si un héro meurt, il perd une vie (il en a trois).</li>
                        <li>Quand le boss tue quelqu'un, une zone rouge apparait sur un diamètre de 4 salles dans une desquelles il se trouve.</li>
                        <li>Si un héros trouve la clef du donjon, il pourra se rendre dans la salle des coffres ou il pourra récolter des objets plus puissants.</li>
                    {/if}
                    {#if rulesPage == 3}
                        <li>Le boss gagne s'il a réussi à tuer tous les héro 3 fois.</li>
                        <li>Les héros gagnent s'ils arrivent à se coordonner afin de le tuer.</li>
                    {/if}
                </ul>
            </div>
            </div>
    <p>{rulesPage}/3</p>

    <button on:click={deincrement} disabled={rulesPage===1}>Précédent</button>
    <button on:click={increment} disabled={rulesPage===3}>Suivant</button>

</div>
<script>
    // @ts-nocheck
    export let user = user;
    console.log("user", user)
    //@TODO : quand il veut changer de room il fait un request au serveur et le serveur envoie les infos au gameboard

    // @TODO : quand il change de room, si il y a un item dans la salle :
        // @TODO : Quand il lance les dés : généréer 2 nbre aléatoire entre 1 et 6
        // @TODO : si dé1+dé2 > condition de rareté (ex : légendaire -> 10)
            // @TODO : récupère l'item et l'envoyé au serveur pour l'ajouter au user
            // @TODO : else : peut relancer les dés ou partir

    // @TODO : quand le combat se lance :
        // @TODO : prendre la vie du boss et le total des atk des users
        // @TODO : si life > atk
            // @TODO : boss gagne, le user le plus faible perd une vie
            // @TODO : si le user n'a plus de vie : mort : spectateur (tous ces items partent avec lui)
        // @TODO : si life = atk 
            // @TODO : tout le monde repart
        // @TODO : else 
            // @TODO : le boss perd de la vie
            // @TODO : si le boss n'a plus de vie : mort : fin de game
        // @TODO : après chaque combat, tous le monde retourne à son spawn

    // @TODO : si le boss est mort ou que l'ensemble de items restants ne suffisent pas pour battre le boss, le jeu se termine

</script>

<!-- @TODO : le joueur arrive sur la case 0 -->
<h1>Your room : {user.room}</h1>
<!-- @TODO : il a des flèches de directions actives en fonction des directions possible de la salle (composant)-->
<!-- @TODO : il a accès à sa carte perso et son inventaire (composant) @TODO : implémenter les abilities -->

<!-- @TODO : quand il change de room, si il y a un item dans la salle : -->
    <!-- @TODO : afficher les dés à lancer et les items avec leur rareté (et condition) (composant) et les flèches s'il veut partir -->
    <!-- @TODO : afficher le résultat des dés -->

<!-- @TODO : quand le boss arrive dans la même salle : -->
    <!-- @TODO : un combat se lance (composant) -->

<!-- @TODO : si le joueur n'a plus de vie alors il meurt et deviens spectateur -->
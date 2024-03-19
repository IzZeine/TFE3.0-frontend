<script>
    // @ts-nocheck
	import { clearStorage, getRoomsConnections, getUser } from "$lib";
	import { onMount } from "svelte";
    import { io } from "socket.io-client";

    const socket = io("http://localhost:3000");

    export let user = user;
    let gameID = "";
    let sessionID = "";    

    //@TODO : quand il veut changer de room il fait un request au serveur et le serveur envoie les infos au gameboard

    let roomsConnections,directions;
    let myRoom = '';

    onMount(async() => {        
        sessionID = sessionStorage.getItem("sessionID");
        gameID = sessionStorage.getItem("gameID")

        socket.on('connect', async() => {
            console.log('Connected to server');
            if (gameID) {
                // trouver l'utilisateur
                user = await getUser(socket)
                console.log(user)
                if(!user){
                    clearStorage()
                    window.location.href = "/"
                }
                socket.emit("joinGame", gameID)
                socket.emit('getRooms', user.gameId)
            }
        });

        disabledArrowDirections()

        socket.on("youAskedRooms", (rooms)=>{
            console.log(user)
            myRoom = rooms[user.room]
            console.log(myRoom)
        })

        socket.on("movePlayer", (userID)=>{
            disabledArrowDirections()
        })
    })

    let disabledArrowDirections = async()=>{
        roomsConnections = await getRoomsConnections()
        roomsConnections = Object.values(roomsConnections) // change Json to array

        directions = roomsConnections[user.room]
        let diectionsKeys = Object.keys(directions)

        for(let direction of diectionsKeys){
            let arrow = document.querySelector("#"+ direction)
            if(directions[direction] != 'null') arrow.removeAttribute("disabled")
        }
    }

    let askToChangeRoom = ()=>{
        let direction = event.target.id
        let targetRoom = directions[direction]
        socket.emit("askToChangeRoom", targetRoom)
    }
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

<p>{user.hero}</p>
<h1>Your room : {user.room}</h1>

<div class="directionsArrows">
    <button class="directionArrow directionArrow_top" id="top" disabled on:click={askToChangeRoom}>
        top
    </button>
    <button class="directionArrow directionArrow_right" id="right" disabled on:click={askToChangeRoom}>
        right
    </button>
    <button class="directionArrow directionArrow_bot" id="bot" disabled on:click={askToChangeRoom}>
        bot
    </button>
    <button class="directionArrow directionArrow_left" id="left" disabled on:click={askToChangeRoom}>
        left
    </button>
</div>
<!-- @TODO : il a accès à sa carte perso et son inventaire (composant) @TODO : implémenter les abilities -->

<!-- @TODO : quand il change de room, si il y a un item dans la salle : -->
    <!-- @TODO : afficher les dés à lancer et les items avec leur rareté (et condition) (composant) et les flèches s'il veut partir -->
    <!-- @TODO : afficher le résultat des dés -->

<!-- @TODO : quand le boss arrive dans la même salle : -->
    <!-- @TODO : un combat se lance (composant) -->

<!-- @TODO : si le joueur n'a plus de vie alors il meurt et deviens spectateur -->
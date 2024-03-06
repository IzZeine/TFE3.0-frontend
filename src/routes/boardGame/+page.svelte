<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    const socket = io("http://localhost:3000");
    import {browser} from '$app/environment';

    let gameID;
    // @TODO : quand il y a au moins 2 user autoriser le bouton play
    let OnlineUsers = 0;

    onMount(async() => {
        gameID = sessionStorage.getItem("gameID")
        socket.on("connect", async() => {
            console.log("Connected to server")
        });

        // Écouter l'événement de réponse du serveur après la création d'utilisateur
        socket.on("userCreated", (id) => {
            console.log(id)
            sessionStorage.setItem("sessionID", id);
        });

        socket.on("updateUsersCount", (count)=>{
            OnlineUsers = count
        })

        console.log(browser)

        if (screen.width < 500){
            window.location.href = "/"
        }
    });

    // @TODO : quand on clic sur le btn play : request server : socket.emit("GameIsReady",OnlineUsers)

    // @TODO : si 6 users alors la game se lance toute seule
</script>

<!-- @TODO : c'est la boardGame qui gère la création de game -->
<h1>BoardGame</h1>
<!-- @TODO : faire le routing du gameBoard : createGame : /boardGame/gameID -->
<!-- @TODO : faire le svg du gameboard avec les salles et les chemins (couloirs) -->
<!-- @TODO : faire l'icon du boss (1 à 3) -->

<!-- @TODO : btn : play -->



<!-- /boardGame/gameID -->

<!-- @TODO : afficher la map et les joueurs à la bonne place de user.room -->
<!-- @TODO : quand le joueur change de salle, le faire suivre le path de couloir et l'amener à la bonne salle -->
<!-- @TODO++ : ajouter des animations quelconques : lancement de combat, récupération d'un item, utilisation de sort -->


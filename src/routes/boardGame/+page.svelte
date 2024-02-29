<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    const socket = io("http://localhost:3000");
    import {browser} from '$app/environment';

    let gameID;
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
</script>

<h1>BoardGame</h1>


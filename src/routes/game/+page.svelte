<script>
// @ts-nocheck
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getUser } from "$lib";
    import { clearStorage } from "$lib";

    const socket = io("http://localhost:3000");
    
    let sessionID = "";    
    let username = "";
    let userID = "";
    let user = "";
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
        socket.on("connect", () => {
            console.log("Connected to server")
        });
        // Écouter l'événement de réponse du serveur après la création d'utilisateur
        socket.on("userCreated", (data) => {
            userID = data.userID;
            console.log("User created with ID:", userID);
            sessionStorage.setItem("sessionID", userID);
        });
        
        user = await getUser()

    });
</script>

{#if sessionID}
    <h1>The game</h1>
    {#if user}
        <h2>Welcome {user.username}</h2>
        {:else}
             <!-- rediriger vers la homepage -->
    {/if}
    {:else}
    <!-- rediriger vers la homepage -->
{/if}


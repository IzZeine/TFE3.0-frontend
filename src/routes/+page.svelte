<!-- Page de connection -->
<script>
// @ts-nocheck

	import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getUser } from "$lib";
    import { clearStorage } from "$lib";

    const socket = io("http://localhost:3000");
    
    let sessionID = "";    
    let gameID = ""
    let userID = "";
    let username = "";
    let user = "";
    let OnlineUsers = 0;
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
        gameID = sessionStorage.getItem("gameID")
        socket.on("connect", () => {
            console.log("Connected to server")
        });

        // Écouter l'événement de réponse du serveur après la création d'utilisateur
        socket.on("userCreated", (id) => {
            console.log(id)
            userID = id;
            console.log("User created with ID:", userID);
            sessionStorage.setItem("sessionID", userID);
        });

        socket.on("updateUsersCount", (count)=>{
            OnlineUsers = count
        })
        
        user = await getUser(socket)

    });

    const onFormSubmit = async () => {
        try {
            console.log("Welcome " + username);
            // Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
            socket.emit("createUser", { username, gameID });
        } catch (error) {
            console.error("Error creating user:", error);
            // Gérer les erreurs ici
        }


        //reload la page quand le form à été envoyé pour avoir le btn "jouer"
        window.location.href = '/game';
    };

    // disabled btn if the input is empty
	function isDirty(username) {
        return username == ''
    }



    let createGame = async ()=>{
        console.log("creation de la game")
        const response = await fetch('http://localhost:3000/creategame');
        const gameJson = await response.json();
        console.log(gameJson)
        gameID = gameJson.gameId
        sessionStorage.setItem("gameID", gameID)
        window.location.reload()
    }
</script>

<!-- html ici -->

<img src="./src/assets/img/logo.png" class="fluidimg logoImg" alt="Logo">

{#if gameID}
    {#if sessionID}
        {#if user}
            <h2>Welcome {user.username}</h2>
            <button class="btnPrimary"><a href="/game">Jouer</a></button>
            <button on:click={clearStorage}>RESET</button>
            {:else}
                <p>User not found</p>
                <button on:click={clearStorage}>RESET</button>
        {/if}
        {:else}
            <form on:submit|preventDefault={onFormSubmit} class="form">
                <div>
                    <label for="username" class="labelForm">Enter your username:</label>
                    <input type="text" name="username" id="username" class="inputForm" placeholder="ex : IzZeine" maxlength="12" autocomplete='off' data-lpignore="true" data-form-type="other" required bind:value={username}/>
                </div>
                <div><span>{OnlineUsers}</span>/6</div>
                <button class="btnPrimary btnForm" disabled='{isDirty(username)}'>Jouer</button>
            </form>
            <button on:click={clearStorage}>reset</button>
    {/if}
    <!-- rediriger vers la partie en question -->
    {:else}
        <button on:click={createGame} class="">Créer</button>
        <button class="">Rejoindre</button>
{/if}
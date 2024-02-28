<script>
// @ts-nocheck

	import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getUser } from "$lib";
    import { clearStorage } from "$lib";

    const socket = io("http://localhost:3000");
    
    let sessionID = "";   
    let gameID = "";
    let gameName = "";
    let username = "";
    let user = "";
    let OnlineUsers = 0;
    let activeGames = [];
    let errorMessage = "";

    //@TODO vérifier la page de l'écran et rediriger ou un clip-rect
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
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
        
        console.log(sessionID)

        user = await getUser(socket)
    });

    const onFormSubmit = async () => {
        try {
            // Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
            socket.emit("createUser", username);
        } catch (error) {
            console.error("Error creating user:", error);
        }
        //reload la page quand le form à été envoyé pour avoir le btn "jouer"
        window.location.reload();
    };

    // disabled btn if the input is empty
	function isDirty(username) {
        return username == ''
    }

    let joinGame = (id) =>{
        socket.emit("joinGame", id)
        sessionStorage.setItem("gameID", id)
    }

    let createGame = async ()=>{
        console.log("My game's name " + gameName);

        const response = await fetch("http://localhost:3000/creategame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: gameName })
        });

        if (response.ok) {
            // Gérer la réponse si nécessaire
            console.log("Game created successfully");
            const gameJson = await response.json();
            console.log(gameJson)
            gameID = gameJson.gameId
            sessionStorage.setItem("gameID", gameID)
            let path = "/game/"+gameID
            window.location.href = path
            joinGame(gameID)
        } else {
            console.error("Failed to create game");
            errorMessage = "Ce nom existe dejà !";
        }


    }

    let askActiveGames = async ()=>{
        const response = await fetch('http://localhost:3000/activegames');
        const activeGamesJson = await response.json();
        activeGames = [...activeGamesJson]
    }

    let displayGames = () =>{
        const display = document.querySelector(".activeGames")
        display.classList.add("is-active")
    }

    let hideGames = () =>{
        const display = document.querySelector(".activeGames")
        display.classList.remove("is-active")
    }

    let displayCreateGames = () =>{
        const display = document.querySelector(".createGame")
        display.classList.add("is-active")
    }

    let hideCreateGames = () =>{
        const display = document.querySelector(".createGame")
        display.classList.remove("is-active")
    }

</script>

<!-- html ici -->

<div class="container">
    <img src="./src/assets/img/logo.png" class="fluidimg logoImg" alt="Logo">

    {#if sessionID}
        {#if user}
            {#if gameID}
                <a href="/game/{gameID}"><button>jouer</button></a>
                {:else}
                    <p>Welcome {user.username}</p>
                    <div class="btnsGames">
                        <button on:click={displayCreateGames} class="btnPrimary">Créer</button>
                        <button on:click={(evt) => { askActiveGames(); displayGames(evt); }} class="btnPrimary">Rejoindre</button>
                    </div>
        
                    <div class="createGame">
                        <div class="content">
                            <div class="btns">
                                <button class="btn-menuGames return" on:click={hideCreateGames}><img src="./src/assets/img/return.svg" alt="return"></button>
                            </div>
                            
                            <form on:submit|preventDefault={createGame} class="gameNameForm">
                                <div class="gameNameForm_content">
                                    <label for="gameName" class="gameNameLabel">Enter your game's name:</label>
                                    <input type="text" name="gameName" id="gameName" class="inputForm" placeholder="ex : IzZeine's game" maxlength="15" autocomplete='off' data-lpignore="true" data-form-type="other" required bind:value={gameName}/>
                                    {#if errorMessage}
                                        <p class="errorCreateGame">{errorMessage}</p>
                                    {/if}
                                </div>
                                <button class="btnPrimary btnForm" disabled='{isDirty(gameName)}'>Jouer</button>
                            </form>
                        </div>
                    </div>
        
                    <div class="activeGames">
                        <div class="content">
                            <div class="btns">
                                <button class="btn-menuGames return" on:click={hideGames}><img src="./src/assets/img/return.svg" alt="return"></button>
                                <button class="btn-menuGames refresh" on:click={askActiveGames}><img src="./src/assets/img/refresh.svg" alt="refresh"></button>
                            </div>
                            <ul>
                            {#each activeGames as game}
                                <li>
                                    <a href="/game/{game.gameId}">
                                        <button on:click={joinGame(game.gameId)} class="btn-joinGames">
                                            <p>{game.name}</p>
                                            <p class="btn-joinGames_statut">{game.statut} <span>{game.users}/6</span></p>
                                        </button>
                                    </a>
                                </li>
                            {/each}
                            </ul>
                        </div>
                    </div>
            {/if}
        {/if}
        {:else}
            <form on:submit|preventDefault={onFormSubmit} class="form">
                <div>
                    <label for="username" class="labelForm">Enter your username:</label>
                    <input type="text" name="username" id="username" class="inputForm" placeholder="ex : IzZeine" maxlength="12" autocomplete='off' data-lpignore="true" data-form-type="other" required bind:value={username}/>
                </div>
                <button class="btnPrimary btnForm" disabled='{isDirty(username)}'>Jouer</button>
            </form>
    {/if}
</div>

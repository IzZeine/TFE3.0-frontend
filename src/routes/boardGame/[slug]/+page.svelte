<script>
    // @ts-nocheck

	import { clearStorage, getGame, getHeroes } from "$lib";
	import { onMount } from "svelte";
    import { io } from "socket.io-client";
    const socket = io("http://localhost:3000");

    let game = ''
    let activeUsers = [];
    let listOfHeroes;
    
    onMount(async() => {

        game = await getGame()

        if (!game){
            clearStorage()
            window.location.href = "/boardGame"
        }

        if (screen.width < 500){
            window.location.href = "/"
        }

        socket.emit("isActiveUsers", game.gameId)
       
        socket.on('updateUsers', (data) => {
            console.log(data)
            activeUsers = data
            let conditionHero = (currentValue) => currentValue.hero
            if(activeUsers.length >= 2 && game.statut == "waiting"){
                let btnClose = document.querySelector(".js-btn-close")
                btnClose.removeAttribute("disabled")
            }
            if (activeUsers.length >= 2 && activeUsers.every(conditionHero) && game.statut == "closed"){
                let btnPlay = document.querySelector(".js-btn-play")
                btnPlay.removeAttribute("disabled")
            }
        })

        listOfHeroes = await getHeroes()
        
    })

    socket.on("updateGame", (data)=>{
        game = data
        console.log(data)
    })

    let closeGame = () => {
        socket.emit("closeGame", game.gameId)
        console.log("close")
    }

    let openGame = () => {
        socket.emit("openGame", game.gameId)
        console.log("open")
    }

    let startGame = () => {
        socket.emit("startGame", game.gameId)
        console.log("start")
    }

</script>

<div class="container">
    {#if game.statut == "started"}
        <img class="fluidimg boardGame" src="/src/assets/img/boardgame.png" alt="boardgame">
        {:else}            
            <h1 class="h1">{game.name}</h1>
            <ul class="cardUserList">
                <!-- @TODO : mettre de base 6 emplacements vide à remplir dès que qql rejoint la game -->
                {#each activeUsers as user}
                    <li class="cardUser">
                        <p class="cardUser_name">{user.username}</p>
                        {#if game.statut == "closed"}
                        <!-- <img src="/src/assets/img/{hero.img}" alt="hero"> -->
                            <p class="cardUser_hero">{user.team}</p>
                            <p class="cardUser_life">{user.life}</p>
                            {#if user.hero}
                                <p class="cardUser_hero">{user.hero}</p>
                                <p class="cardUser_atk">{user.atk}</p>
                                {:else}
                                    <p class="cardUser_hero">...</p>
                                    <p class="cardUser_atk">...</p>
                            {/if}
                        {/if}
                    </li>
                {/each}
            </ul>
                
            {#if game.statut == "closed"}
                <button class="btnPrimary js-btn-play" disabled on:click={startGame}>Jouer</button>
                <button class="btnPrimary js-btn-play" on:click={openGame}>ouvrir</button>
                {:else}
                    <button class="btnPrimary js-btn-close" disabled on:click={closeGame}>Fermer</button>        
            {/if}
    {/if}
</div>
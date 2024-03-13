<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getHeroes, getItems, getUser, clearStorage, getGame } from "$lib";
    import GameRules from "$lib/composants/GameRules.svelte";
    import ChooseHero from "$lib/composants/ChooseHero.svelte";
    import Wait from "$lib/composants/Wait.svelte";
    import Map from "$lib/composants/Map.svelte";

    const socket = io("http://localhost:3000");
    
    let gameID = ""; // tout doit être relatif à la partie en cours
    let sessionID = "";    
    let user = "";
    let game = "";
    let gameStep = 1;
    let hero = '';
    let listOfItems = '';
    let listOfHeroes = '';
    // @TODO : il faut que tout s'actualise tout le temps
    let wait = true;
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
        if(!sessionID){
            clearStorage()
            window.location.href = "/"
        }
        gameID = sessionStorage.getItem("gameID")
        if(!gameID){
            window.location.href = "/game"
        }
        console.log("session Id :",sessionID)
        console.log('gameID', gameID)

        socket.on('connect', () => {
            console.log('Connected to server');
            if (gameID) {
                socket.emit("joinGame", gameID)
            }
        });

        // @TODO : deco intempestives...
        socket.on("deco", () => {
            alert("a lot of users")
            clearStorage();
            window.location.href = '/game';
        })

        if (screen.width > 500){
            {window.location.href = "/boardGame"}
        }

        
        // trouver l'utilisateur
        user = await getUser(socket)
        if(!user){
            clearStorage()
            window.location.href = "/"
        }
        //trouver la game
        game = await getGame()
        console.log(game)
        //importer les heros
        listOfHeroes = await getHeroes()
        //importer les items
        listOfItems = await getItems()

    });

    socket.on("updateGame", (data)=>{
        game = data
    })

    socket.on ("wait", ()=>{
        wait = true;
    })

    function sentHeroToServer(event){
        hero = event.detail.hero;
        socket.emit("selectedHero", hero)
    }

    // mettre à jour le user quand le hero a été choisi et enregistré dans la db
    socket.on("registeredHero", async()=>{
        user = await getUser(socket);
    })

    function upGameStep () {
        gameStep++
        console.log(gameStep)
    }
</script>

{#if sessionID}
    {#if user}
        {#if game.statut == "waiting"}
            <GameRules />
        {/if}
        {#if game.statut == "closed"}
            <ChooseHero {user} on:ChooseHero={(evt) => { upGameStep(); sentHeroToServer(evt); }} />
        {/if}
        {#if game.statut == "started"}
            <Map {user} />
        {/if}
    {/if}       
{/if}

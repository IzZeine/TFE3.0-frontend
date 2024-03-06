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
            if (sessionID) {
                socket.emit('MyID', sessionID);
            }
        });

        // @deco intempestives...
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
            window.location.href = "/"
        }
        //trouver la game
        game = await getGame()
        //importer les heros
        listOfItems = await getItems()
        //importer les items
        listOfHeroes = await getHeroes()

    });

    socket.on("gameStep", (data)=>{
        gameStep = data;
        // wait = false
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

    function wantToDoSomething () {
        socket.emit("wantToDoSomething")
    }
</script>

{#if sessionID}
    {#if user}
        {#if wait == true}
            <Wait {game} />
            {:else}
                <!-- @TODO : laisser ici ou faire /game/gameID/Gamerules ?  same shit pour les autres steps-->
                {#if gameStep == 1}
                    <GameRules />
                    <button on:click={wantToDoSomething}>Jouer</button>
                {/if}
                {#if gameStep == 2}
                    <!-- @TODO : faire passer le user -->
                    <ChooseHero on:ChooseHero={(evt) => { wantToDoSomething(); sentHeroToServer(evt); }} />
                {/if}
                {#if gameStep == 3}
                    <Map {user} />
                {/if}
        {/if}
    {/if}       
{/if}

<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getHeroes, getItems, getUser, clearStorage } from "$lib";
	import GameRules from "$lib/composants/GameRules.svelte";
	import ChooseHero from "$lib/composants/ChooseHero.svelte";
	import Wait from "$lib/composants/Wait.svelte";
	import Map from "$lib/composants/Map.svelte";
    import { browser } from "$app/environment";

    const socket = io("http://localhost:3000");
    
    // @TODO : créer un page game pour chaque partie avec l'ID de la game à la fin de l'url
    let gameID = ""; // tout doit être relatif à la partie en cours
    let sessionID = "";    
    let user = "";
    let gameStep = 1;
    let hero = '';
    let listOfItems = '';
    let listOfHeroes = '';
    let wait = false;
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
        gameID = sessionStorage.getItem("gameID")
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
            window.location.href = '/';
        })
        
        // trouver l'utilisateur
        user = await getUser()
        //  TODO : doesnt work
        console.log(user)
        //importer les heros
        listOfItems = await getItems()
        //importer les items
        listOfHeroes = await getHeroes()

    });

    socket.on("gameStep", (data)=>{
        gameStep = data;
        wait = false
    })

    socket.on ("wait", ()=>{
        wait = true;
    })

    function sentHeroToServer(event){
        hero = event.detail.hero;
        socket.emit("selectedHero", hero.name)
    }

    // mettre à jour le user quand le hero a été choisi et enregistré dans la db
    socket.on("registeredHero", async()=>{
        user = await getUser();
    })

    function wantToDoSomething () {
        socket.emit("wantToDoSomething")
    }
</script>

{#if sessionID}
    {#if user}
        {#if wait == true}
            <Wait />
            {:else}
                {#if gameStep == 1}
                    <GameRules />
                    <button on:click={wantToDoSomething}>Jouer</button>
                {/if}        
                {#if gameStep == 2}
                    <ChooseHero on:ChooseHero={(evt) => { wantToDoSomething(); sentHeroToServer(evt); }} />
                {/if}
                {#if gameStep == 3}
                    {#if user.hero}
                        <Map {user} />
                    {:else}
                        <p>Vous n'avez pas de hero</p>
                        <button><a href="/">Retour</a></button>
                    {/if}
                {/if}
        {/if}
        {:else}
            <p>Votre joueur n'existe pas</p>
            <button><a href="/">Retour</a></button>
    {/if}       
    {:else}
        <p>Votre session n'existe pas</p>
        <button><a href="/">Retour</a></button>
{/if}

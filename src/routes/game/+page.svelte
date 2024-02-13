<script>
// @ts-nocheck
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getUser } from "$lib";
    import { clearStorage } from "$lib";
	import GameRules from "$lib/composants/GameRules.svelte";
	import ChooseHero from "$lib/composants/ChooseHero.svelte";
	import Map from "$lib/composants/Map.svelte";

    const socket = io("http://localhost:3000");
    
    let sessionID = "";    
    let username = "";
    let userID = "";
    let user = "";
    let gameStep = 1;
    let hero = '';
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");

        socket.on('connect', () => {
            console.log('Connected to server');
            if (sessionID) {
                socket.emit('MyID', sessionID);
            }
	    });
        
        // trouver l'utilisateur
        user = await getUser()

    });

    socket.on("gameStep", (data)=>{
        gameStep=data;
        console.log(gameStep)
    })

    function readyToChangeStep (){
        socket.emit("changeStep", gameStep)
    }

    function sentHeroToServer(event){
        hero = event.detail.ChooseHero.selectedHero;
        socket.emit("selectedHero", hero)
    }
</script>

{#if sessionID}
    {#if user}
        {#if gameStep == 1}
            <GameRules />
            <button on:click={readyToChangeStep}>Jouer</button>
        {/if}        
        {#if gameStep == 2}
            <ChooseHero on:ChooseHero={() => { readyToChangeStep(); sentHeroToServer(); }} />
        {/if}
        {#if gameStep == 3}
            <Map />
        {/if}
        {:else}
            <p>Votre joueur n'existe pas</p>
            <button><a href="/">Retour</a></button>
    {/if}
    {:else}
        <p>Votre session n'existe pas</p>
        <button><a href="/">Retour</a></button>
{/if}

<script>
    // @ts-nocheck
	import BoardGameSVG from "$lib/composants/BoardGameSVG.svelte";
    import {onMount } from 'svelte';
    // import { io } from "socket.io-client";

    // const socket = io("http://localhost:3000");

    export let activeUsers = activeUsers;
    let TargetX, TargetY;

    onMount(async() => {
        let target = document.querySelector("#player1")
        TargetX = target.getBoundingClientRect().x
        TargetY = target.getBoundingClientRect().y

    })

</script>

<div class="boardGame">
    <ul class="usersPawnList">
        {#each activeUsers as user, index}
            <li class="userPawn" id="PawnPlayer{index+1}" style="left: {TargetX}px; top: {TargetY}px">
                <!-- @TODO : afficher l'img en fonction du hero -->
                <img class="fluidimg userPawn_img" src="/src/assets/img/rodeur.png" alt="pawn icon">
            </li>
        {/each}
    </ul>
    <img class="fluidimg boardGameImg" src="/src/assets/img/boardgame.png" alt="boardgame">
    <BoardGameSVG />
</div>

<style>
	:global(svg) {
		max-width: 100%;
        height : 100%;
		display: block;
	}
</style>
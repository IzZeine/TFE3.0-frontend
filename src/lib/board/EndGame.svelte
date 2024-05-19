<script>
  // @ts-nocheck
	import { goto } from "$app/navigation";
	import { clearDataBase } from "$lib/api/clearDataBase.js";
	import { onMount } from "svelte";
	import { socket } from '$lib/api/socketConnection.js';
	import { clearStorage } from "$lib/api/clearStorage.js";

  export let winner = winner;

  onMount(async ()=> {
    if (!winner) {
      console.log(winner)
      clearStorage()
    }
    console.log(winner)
    if (!Array.isArray(winner)) {
      winner = [winner];
    }
    console.log(winner)
  })
</script>

<div class="container">
  {#if winner}
    <div class="endgame">
      <h1 class="h1 winner-team">L'equipe : <span>{winner[0].team}</span></h1>
      <h2 class="h2">remporte la partie !</h2>
      <ul class="winners">
        {#each winner as player}
        <li>
          <img class="fluidimg" src="/assets/img/{player.heroImg}" alt="player">
        </li>
        {/each}
      </ul>
      <button class="btnPrimary" on:click={() => clearDataBase(socket)}>Quitter</button>
    </div>
  {/if}
</div>
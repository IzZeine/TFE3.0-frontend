<script>
  // @ts-nocheck
  import { createEventDispatcher, onMount } from 'svelte';
  import Carousel from "svelte-carousel";
	import { getHeroes } from '$lib';

  let heroes = ""
  let selectedHero = ""

  onMount(async() => {
    heroes = await getHeroes(); // get Json
    heroes = Object.values(heroes) // change Json to array
    console.log(heroes)
    selectedHero = heroes[0];
  })

  const dispatch = createEventDispatcher();

  function chooseHero (){
    dispatch('ChooseHero',{
        hero : selectedHero
    })
    console.log(selectedHero)
  }

  let carousel; // for calling methods of the carousel instance
  const handleNextClick = () => {
    carousel.goToNext();
  };
  const handlePrevClick = () => {
    carousel.goToPrev();
  };

</script>

<div class="chooseHero">
    <h1 class="h1">Tu es un hero !</h1>
    <h2 class="h2">Lequel choisis-tu ?</h2>
    {#if heroes}
    <Carousel
        bind:this={carousel}
        on:pageChange={
            (event) => {
                selectedHero = heroes[event.detail]
                console.log(selectedHero)
            }
        }   
    >   
        
          {#each heroes as hero}
              <div class="heroItem">
                  <img class="fluidimg heroImg" src="/src/assets/img/{hero.img}" alt={hero.name}/>
              </div>
          {/each}

        <div class="arrowNavigate" slot="prev">
            <!-- <img src="./src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item prev"> -->
            <button on:click={handlePrevClick}><img src="/src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item prev"></button>
        </div>
        <div class="arrowNavigate" slot="next">
            <!-- <img src="./src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item prev"> -->
            <button on:click={handleNextClick}><img src="/src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item next" style="transform: scale(-1);"></button>
        </div>
        <div slot="dots">
            <!--delete dots-->
        </div>
    </Carousel>
    {/if}

    <p class="h1" style="color: {selectedHero.color};">{selectedHero.name}</p>
    <p class="abilityTitle">Habilité :</p>
    <p class="heroDescription" >{selectedHero.ability}</p>
    <button on:click={chooseHero} class="btnPrimary">Choose</button>

</div>
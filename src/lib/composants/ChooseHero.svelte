<script>
    // @ts-nocheck
    import { createEventDispatcher } from 'svelte';
    import Carousel from "svelte-carousel";

    let selectedHero ={
        name: "Chevalier",
        img: "./src/assets/img/knight.png",
        ability: "Le chevalier double sa vie pendant une minute (une fois par partie)",
        color : "#949494"
    };

    const dispatch = createEventDispatcher();

    function chooseHero (){
        dispatch('ChooseHero',{
            hero : selectedHero
        })
        console.log(selectedHero)
    }

    const heroes = [
      {
        name: "Chevalier",
        img: "./src/assets/img/knight.png",
        ability: "Le chevalier double sa vie pendant une minute (une fois par partie)",
        color : "#949494"
      },
      {
        name: "Magicien",
        img: "./src/assets/img/wizard.png",
        ability: "Le magicien peut se rendre invisible et se déplacer librement pendant 5 sec.",
        color : "#FC750C"
      },
      {
        name: "Rodeur",
        img: "./src/assets/img/rodeur.png",
        ability: "Le rodeur se rend invisible et se déplace librement pendant 5 sec.",
        color : "#E35457"
      },
      {
        name: "Faucheuse",
        img: "./src/assets/img/death.png",
        ability: "Le magicien peut révéler la localisation du boss de donjon dans une zone de 4 cases.",
        color : "#B90404"
      },
      {
        name: "Druide",
        img: "./src/assets/img/druide.png",
        ability: "Le druide soigne un allié à hauteur de deux vies.",
        color : "#2BC44E"
      },
      
    ];
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
    <Carousel
        bind:this={carousel}
        on:pageChange={
            (event) => {
                selectedHero = heroes[event.detail]
            }
        }   
    >
        {#each heroes as hero}
            <div class="heroItem">
                <img class="fluidimg heroImg" src={hero.img} alt={hero.name}/>
            </div>
        {/each}
        <div class="arrowNavigate" slot="prev">
            <!-- <img src="./src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item prev"> -->
            <button on:click={handlePrevClick}><img src="./src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item prev"></button>
        </div>
        <div class="arrowNavigate" slot="next">
            <!-- <img src="./src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item prev"> -->
            <button on:click={handleNextClick}><img src="./src/assets/img/arrow.svg" alt="prev" class="fluidimg arrowNavigate-item next" style="transform: scale(-1);"></button>
        </div>
        <div slot="dots">
            <!--delete dots-->
        </div>
    </Carousel>
    <p class="h1" style="color: {selectedHero.color};">{selectedHero.name}</p>
    <p class="abilityTitle">Habilité :</p>
    <p class="heroDescription" >{selectedHero.ability}</p>
    <button on:click={chooseHero} class="btnPrimary">Choose</button>

</div>
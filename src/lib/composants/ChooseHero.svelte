<script>
    // @ts-nocheck
    import { createEventDispatcher } from 'svelte';
    import Carousel from "svelte-carousel";

    let selectedHero ={
        name: "Chevalier",
        img: "./src/assets/img/knight.png",
        ability: "Le chevalier double sa vie pendant une minute (une fois par partie)"
    };

    const dispatch = createEventDispatcher();

    function chooseHero (){
        dispatch('ChooseHero',{
            hero : {selectedHero}
        })
    }

    function selectHero(hero) {
        selectedHero = hero;
    }

    const heroes = [
      {
        name: "Chevalier",
        img: "./src/assets/img/knight.png",
        ability: "Le chevalier double sa vie pendant une minute (une fois par partie)"
      },
      {
        name: "Magicien",
        img: "./src/assets/img/wizard.png",
        ability: "Le magicien peut se rendre invisible et se déplacer librement pendant 5 sec."
      },
      {
        name: "Rodeur",
        img: "./src/assets/img/rodeur.png",
        ability: "Le rodeur se rend invisible et se déplace librement pendant 5 sec."
      },
      {
        name: "Faucheuse",
        img: "./src/assets/img/death.png",
        ability: "Le magicien peut révéler la localisation du boss de donjon dans une zone de 4 cases."
      },
      {
        name: "Druide",
        img: "./src/assets/img/druide.png",
        ability: "Le druide soigne un allié à hauteur de deux vies."
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
    <!-- <ul class="heroesList">
        <li class="heroItem"><img src="./src/assets/img/knight.png" alt="chevalier" class="fluidimg heroImg"></li>
        <li class="heroItem"><img src="./src/assets/img/druide.png" alt="druide" class="fluidimg heroImg"></li>
        <li class="heroItem"><img src="./src/assets/img/rodeur.png" alt="rodeur" class="fluidimg heroImg"></li>
        <li class="heroItem"><img src="./src/assets/img/death.png" alt="faucheuse" class="fluidimg heroImg"></li>
        <li class="heroItem"><img src="./src/assets/img/wizard.png" alt="magicien" class="fluidimg heroImg"></li>
    </ul> -->
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
            <!-- -->
        </div>

    </Carousel>
    <p>{selectedHero.name}</p>
    <p>Habilité :</p>
    <p>{selectedHero.ability}</p>
    <button on:click={chooseHero} class="btnPrimary">Choose</button>

</div>
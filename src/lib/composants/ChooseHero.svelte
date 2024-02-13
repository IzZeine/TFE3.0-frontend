<script>
    // @ts-nocheck
    import { createEventDispatcher } from 'svelte';

    let selectedHero = "Chevalier"

    const dispatch = createEventDispatcher();

    function chooseHero (){
        dispatch('ChooseHero',{
            hero : {selectedHero}
        })
    }

    function selectHero(hero) {
        selectedHero = hero;
    }
</script>


<style>
    .redButton {
        background-color: red;
        color: white;
    }
</style>

<div>
    <h1>Tu es un hero !</h1>
    <h2>Lequel choisis-tu ?</h2>
    <ul>
        <li><button class="{selectedHero === 'Chevalier' ? 'redButton' : ''}" on:click={() => selectHero('Chevalier')}>Chevalier</button></li>
        <li><button class="{selectedHero === 'Druide' ? 'redButton' : ''}" on:click={() => selectHero('Druide')}>Druide</button></li>
        <li><button class="{selectedHero === 'Magicien' ? 'redButton' : ''}" on:click={() => selectHero('Magicien')}>Magicien</button></li>
        <li><button class="{selectedHero === 'Faucheuse' ? 'redButton' : ''}" on:click={() => selectHero('Faucheuse')}>Faucheuse</button></li>
        <li><button class="{selectedHero === 'Rodeur' ? 'redButton' : ''}" on:click={() => selectHero('Rodeur')}>Rodeur</button></li>
    </ul>
    <p>Héros choisi : {selectedHero}</p>
    <button on:click={chooseHero}>Choose</button>

</div>
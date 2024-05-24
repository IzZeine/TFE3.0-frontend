<script>
	import RodeurDialog from './powers/RodeurDialog.svelte';
	import KnightDialog from './powers/KnightDialog.svelte';
	import DruideDialog from './powers/DruideDialog.svelte';
	import NecromancerDialog from './powers/NecromancerDialog.svelte';
	import WizardDialog from './powers/WizardDialog.svelte';
	import GolemDialog from './powers/GolemDialog.svelte';
	import SnakeDialog from './powers/SnakeDialog.svelte';
	import DragonDialog from './powers/DragonDialog.svelte';

	import { createEventDispatcher } from 'svelte';

	export let user;
	export let currentDialog;

	const dispatch = createEventDispatcher();

	const useAbility = (data) => {
		console.log('ability');
	};

	function closeDialog() {
		dispatch('closeDialog');
	}
</script>

{#if user.hero === 'Rodeur'}
	<RodeurDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Chevalier'}
	<KnightDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Druide'}
	<DruideDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Necromancien'}
	<NecromancerDialog
		{user}
		{currentDialog}
		on:closeDialog={closeDialog}
		on:useAbility={useAbility}
	/>
{/if}
{#if user.hero === 'Magicien'}
	<WizardDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Golem'}
	<GolemDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Serpent'}
	<SnakeDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Dragon'}
	<DragonDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}

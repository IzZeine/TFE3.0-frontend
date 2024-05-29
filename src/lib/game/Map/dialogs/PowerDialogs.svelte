<script>
	import RodeurDialog from './powers/RodeurDialog.svelte';
	import KnightDialog from './powers/KnightDialog.svelte';
	import DruideDialog from './powers/DruideDialog.svelte';
	import NecromancerDialog from './powers/NecromancerDialog.svelte';
	import WizardDialog from './powers/WizardDialog.svelte';
	import GolemDialog from './powers/GolemDialog.svelte';
	import SnakeDialog from './powers/SnakeDialog.svelte';
	import DragonDialog from './powers/DragonDialog.svelte';
	import { user } from '$lib/api/stores';

	import { createEventDispatcher } from 'svelte';
	import { socket } from '$lib/api/socketConnection';

	export let currentDialog, game;

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}

	const useAbility = (data) => {
		console.log(data);
		let power = {
			user: $user,
			target: data.detail,
			timestamp: Date.now()
		};
		socket.emit('usePower', power);
		closeDialog();
	};
</script>

{#if $user.hero === 'Rodeur'}
	<RodeurDialog {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if $user.hero === 'Chevalier'}
	<KnightDialog {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if $user.hero === 'Druide'}
	<DruideDialog {currentDialog} {game} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if $user.hero === 'Necromancien'}
	<NecromancerDialog
		{currentDialog}
		{game}
		on:closeDialog={closeDialog}
		on:useAbility={useAbility}
	/>
{/if}
{#if $user.hero === 'Magicien'}
	<WizardDialog {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if $user.hero === 'Golem'}
	<GolemDialog {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if $user.hero === 'Serpent'}
	<SnakeDialog {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if $user.hero === 'Dragon'}
	<DragonDialog {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}

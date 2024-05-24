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
	import { socket } from '$lib/api/socketConnection';

	export let user, currentDialog, game;

	const dispatch = createEventDispatcher();

	function closeDialog() {
		dispatch('closeDialog');
	}

	const useAbility = (data) => {
		console.log(data.detail);
		return;
		switch (user.hero) {
			case 'Rodeur':
				socket.emit('askToChangeRoom', data.detail);
				break;
			case 'Chevalier':
				socket.emit('moveFaster');
				break;
			case 'Necromancien':
				socket.emit('saveUser', data.detail);
				break;
			case 'Druide':
				socket.emit('healUser', data.detail);
				break;
			case 'Magicien':
				socket.emit('upDices');
				break;
			case 'Serpent':
				socket.emit('nerfDices');
				break;
			case 'Golem':
				socket.emit('getRock');
				break;
			default:
				console.log('nobody');
		}
	};
</script>

{#if user.hero === 'Chevalier'}
	<RodeurDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === ''}
	<KnightDialog {user} {currentDialog} on:closeDialog={closeDialog} on:useAbility={useAbility} />
{/if}
{#if user.hero === 'Druide'}
	<DruideDialog
		{user}
		{currentDialog}
		{game}
		on:closeDialog={closeDialog}
		on:useAbility={useAbility}
	/>
{/if}
{#if user.hero === 'Necromancien'}
	<NecromancerDialog
		{user}
		{currentDialog}
		{game}
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

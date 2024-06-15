<script>
	import { socket } from '$lib/api/socketConnection';
	import { onMount } from 'svelte';
	import Log from './log.svelte';
	import { logs } from '$lib/api/stores';
	import { _ } from 'svelte-i18n';

	export let roomsInfos;

	let logsArray = [];

	const createLog = (type, user, room, item) => {
		let log = {
			type: type,
			user: user,
			room: room,
			item: item
		};
		logsArray.push(log);
		logs.set(logsArray);
		sessionStorage.setItem('logs', JSON.stringify(logsArray));
	};

	let onUserMove = (data) => {
		createLog('move', data, data.room);
	};

	let onItemTaken = (data) => {
		let { user, item } = data;
		if (item == 'key') {
			createLog('key', user, user.room, item);
			return;
		}
		createLog('item', user, user.room, item);
	};

	let onPowerUsed = (data) => {
		createLog('power', data, data.room);
	};

	let onBattleStarted = (data) => {
		createLog('battleStarted', data[0], data[0].room);
	};

	let onBattleEnded = (data) => {
		let { room, winner } = data;
		createLog('battleEnded', winner[0], room);
	};

	let onTakeRock = (data) => {
		createLog('rock', data, data.room);
	};

	let clearLogs = () => {
		sessionStorage.removeItem('logs');
		logsArray = [];
		logs.set(logsArray);
	};

	onMount(() => {
		if (sessionStorage.getItem('logs')) {
			let getDataLogs = sessionStorage.getItem('logs');
			logsArray = JSON.parse(getDataLogs);
			logs.set(logsArray);
		}
		socket.on('logMove', onUserMove);
		socket.on('logItem', onItemTaken);
		socket.on('logPower', onPowerUsed);
		socket.on('logBattle', onBattleStarted);
		socket.on('logBattleEnded', onBattleEnded);
		socket.on('logRock', onTakeRock);

		return () => {
			socket.off('logMove', onUserMove);
			socket.off('logItem', onItemTaken);
			socket.off('logPower', onPowerUsed);
			socket.off('logBattle', onBattleStarted);
			socket.off('logBattleEnded', onBattleEnded);
			socket.off('logRock', onTakeRock);
		};
	});
</script>

<div class="logsContainer">
	<div class="innerLogs">
		<ul class="logs">
			{#if $logs}
				{#each $logs as log}
					<Log {log} {roomsInfos} />
				{/each}
			{/if}
		</ul>
		<button class="clearLogs" on:click={clearLogs}>{$_('desktop.boardGame.clear')}</button>
	</div>
</div>

<style lang="scss">
	.logsContainer {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 1rem;
		overflow: hidden;
		padding-top: 0;

		.innerLogs {
			display: flex;
			gap: 24px;
			flex-direction: column;
			height: 100%;
			width: 100%;
			background-color: var(--BG);
			mask-image: radial-gradient(circle at 1.5rem 1.5rem, transparent 1.5rem, gold 0);
			mask-position: -1.5rem -1.5rem;
			mask-repeat: repeat;
		}

		.logs {
			overflow: hidden;
			overflow-wrap: break-word;
			box-sizing: border-box;
			padding: 2rem 1rem 0;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			gap: 6px;
		}

		.clearLogs {
			padding: 6px 12px;
			background-color: var(--BGTranspary);
			color: var(--txtPrimary);
			margin-top: auto;
			margin-bottom: 24px;
			align-self: center;
			transition: 0.2s;
			&:hover {
				background-color: var(--primary);
				color: var(--black);
			}
		}
	}
</style>

<script>
	import { socket } from '$lib/api/socketConnection';
	import { onMount } from 'svelte';
	import Log from './log.svelte';
	import { logs } from '$lib/api/stores';

	$: logsArray = [];

	let onUserMove = (data) => {
		let log = {
			type: 'move',
			user: data,
			target: data.room
		};
		logsArray.push(log);
		logs.set(logsArray);
		sessionStorage.setItem('logs', JSON.stringify(logsArray));
	};

	let onItemTaken = (data) => {
		let log = {
			type: 'item',
			user: data,
			target: data.room
		};
		logsArray.push(log);
		logs.set(logsArray);
		sessionStorage.setItem('logs', JSON.stringify(logsArray));
	};

	let clearLogs = () => {
		sessionStorage.removeItem('logs');
		logsArray = [];
		logs.set(logsArray);
	};

	onMount(() => {
		let getDataLogs = sessionStorage.getItem('logs');
		logsArray = JSON.parse(getDataLogs);
		logs.set(logsArray);
		socket.on('logMove', onUserMove);
		socket.on('logItem', onItemTaken);
		// @TODO la suite
		return () => {
			socket.off('logMove', onUserMove);
		};
	});
</script>

<div class="logsContainer">
	<div class="innerLogs">
		<ul class="logs">
			{#each $logs as log}
				<Log {log} />
			{/each}
		</ul>
		<button class="clearLogs" on:click={clearLogs}>clear</button>
	</div>
</div>

<style lang="scss">
	.logsContainer {
		box-sizing: border-box;
		border-left: solid 3px var(--txtPrimary);
		height: 100%;
		width: 100%;
		padding: 1rem;
		overflow: hidden;

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
			padding: 2rem 2rem 0;
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
		}
	}
</style>

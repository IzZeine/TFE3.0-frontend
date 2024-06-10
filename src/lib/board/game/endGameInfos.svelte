<script>
	import { socket } from '$lib/api/socketConnection';
	import { onMount } from 'svelte';

	let animEnd = '';
	let msg;

	const onEndGameTurn = (data) => {
		animEnd = 'isActive';
		msg = 'Fin des tours ! Le boss remporte la victoire';
	};
	const onEndGameKey = (data) => {
		animEnd = 'isActive';
		msg = 'Les heros ont trouvés le clef et se sojnt enfuis!';
	};
	const onEndGameBattle = (data) => {
		animEnd = 'isActive';
		msg = "Ce combat a fort maltourné, il en est fini de l'exploration!";
	};

	onMount(() => {
		socket.on('endGameTurn', onEndGameTurn);
		socket.on('endGameKey', onEndGameKey);
		socket.on('endGameBattle', onEndGameBattle);
		return () => {
			socket.off('endGameTurn', onEndGameTurn);
			socket.off('endGameKey', onEndGameKey);
			socket.off('endGameBattle', onEndGameBattle);
		};
	});
</script>

<div class="endGameInfos {animEnd}">
	<p class="h1">{msg}</p>
</div>

<style lang="scss">
	.endGameInfos {
		display: none;
		position: absolute;
		width: 100%;
		height: 100%;
		transition: 0.2s;
		background-color: var(--BGTranspary);
		text-wrap: nowrap;
		top: 0;
		justify-content: center;
		align-items: center;
	}
	.endGameInfos.isActive {
		display: flex;
		p {
			opacity: 0;
			animation: animEnd 3s;
		}
	}

	@keyframes animEnd {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		25% {
			opacity: 1;
			transform: scale(1.2);
		}
		75% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0);
		}
	}
</style>

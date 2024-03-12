<script>
    // @ts-nocheck

	import { getGame } from "$lib";
	import { onMount } from "svelte";
    import { io } from "socket.io-client";
    const socket = io("http://localhost:3000");

    let game = ''
    let activeUsers = [];

    onMount(async() => {
        game = await getGame()
        socket.emit("boardWaitingUsers", game.gameId)

        if (screen.width < 500){
            window.location.href = "/"
        }

        socket.emit("isActiveUsers", game.gameId)

        socket.on('activeUsers', (data) => {
            activeUsers = data
        })
        
    })

    // @TODO : faire que activeusers soit au courant de ce qu'il se passe......
    console.log(activeUsers)


</script>


<h2>ActivePlayers :</h2>
{#each activeUsers as user}
    <li>
        <p>{user.username}</p>
    </li>
{/each}

<button class="btnPrimary">Jouer</button>
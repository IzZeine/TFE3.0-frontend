<!-- Page de connection -->
<script>
// @ts-nocheck

	import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getUser } from "$lib";
    import { clearStorage } from "$lib";

    const socket = io("http://localhost:3000");
    
    let sessionID = "";    
    let username = "";
    let userID = "";
    let user = "";
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
        socket.on("connect", () => {
            console.log("Connected to server")
        });
        // Écouter l'événement de réponse du serveur après la création d'utilisateur
        socket.on("userCreated", (data) => {
            userID = data.userID;
            console.log("User created with ID:", userID);
            sessionStorage.setItem("sessionID", userID);
        });
        
        user = await getUser()

    });

    const onFormSubmit = async () => {
        try {
            console.log("Welcome " + username);
            // Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
            socket.emit("createUser", { username });
        } catch (error) {
            console.error("Error creating user:", error);
            // Gérer les erreurs ici
        }
        //reload la page quand le form à été envoyé pour avoir le btn "jouer"
        location.reload(true);
    };
</script>

<!-- html ici -->

{#if sessionID}
    {#if user}
        <h2>Welcome {user.username}</h2>
        <button><a href="/game">jouer</a></button>
        <button on:click={clearStorage}>RESET</button>
        {:else}
            <p>User not found</p>
        <button on:click={clearStorage}>RESET</button>
    {/if}
    {:else}
        <form class="form-example" on:submit|preventDefault={onFormSubmit}>
            <div class="form-example">
                <label for="username">Enter your username:</label>
                <input type="text" name="username" id="username" required bind:value={username}/>
            </div>
            <button>submit</button>
        </form>
{/if}
        
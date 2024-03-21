<script>
// @ts-nocheck

	import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { getUser } from "$lib";

    const socket = io("http://localhost:3000");
    
    let sessionID = "";   
    let gameID = "";
    let username = "";
    let user = "";
    let OnlineUsers = 0;
    
    onMount(async() => {
        sessionID = sessionStorage.getItem("sessionID");
        if(sessionID){
            window.location.href = "/game"
        }
        gameID = sessionStorage.getItem("gameID")
        if(gameID){
            window.location.href = "/game/" + gameID
        }
        socket.on("connect", async() => {
            console.log("Connected to server")
        });

        // Écouter l'événement de réponse du serveur après la création d'utilisateur
        socket.on("userCreated", (id) => {
            console.log(id)
            sessionStorage.setItem("sessionID", id);
            window.location.reload();
        });

        socket.on("updateUsersCount", (count)=>{
            OnlineUsers = count
        })
        
        if (screen.width > 500){
            window.location.href = "/boardGame"
        }

        user = await getUser(socket)
        if(user){
            window.location.href = "/game"
        }

    });

    const onFormSubmit = async () => {
        try {
            // Envoyer le nom d'utilisateur au serveur pour créer l'utilisateur
            socket.emit("createUser", username);
        } catch (error) {
            console.error("Error creating user:", error);
        }
        //reload la page quand le form à été envoyé pour avoir le btn "jouer"
    };

    // disabled btn if the input is empty
	function isDirty(username) {
        return username == ''
    }

</script>

<div class="container">
    <img src="./src/assets/img/logo.png" class="fluidimg logoImg" alt="Logo">
    <form on:submit|preventDefault={onFormSubmit} class="form">
        <div>
            <label for="username" class="labelForm">Enter your username:</label>
            <input type="text" name="username" id="username" class="inputForm" placeholder="ex : IzZeine" maxlength="12" autocomplete='off' data-lpignore="true" data-form-type="other" required bind:value={username}/>
        </div>
        <button class="btnPrimary btnForm" disabled='{isDirty(username)}'>Jouer</button>
    </form>
</div>

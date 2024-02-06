<script>
// @ts-nocheck

	import { onMount } from "svelte";

    // @ts-ignore
    let users = [];

    onMount(()=>{
        displayUsers()
    })

    async function displayUsers() {
        const reponse = await fetch("http://localhost:3000/users");
        const usersJson = await reponse.json();
        console.log(usersJson);
        users = usersJson
    }
</script>

<h1>Les joueurs</h1>
<ul>
    {#if users}
        <!-- content here -->
        {#each users as user}
            <li>{user.username}</li>
        {/each}
    {/if}
</ul>
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { authorize, getGame, deleteUserFromGame } from '../api';
  import { GameSchema } from '../model';
  import { z } from 'zod';

  type Game = z.infer<typeof GameSchema>

  export let gameId: number
  export let loggedInUserName: string

  const dispatch = createEventDispatcher()
  const dispatchBack = () => dispatch('back')

  let game: Game | null = null

  const addPlayer = async (playerId: number): Promise<void> => {
    authorize(gameId, playerId)
  }

  const deletePlayer = async (username: string) => {
    deleteUserFromGame(gameId, username)
  }

  onMount(() => {
    setInterval(async () => {
      const response = await getGame(gameId)
      if (!response.success) return
      game = response.data
    }, 500)
  })
</script>

{#if !game}
<div class="flex justify-center">
  <div class="loading loading-spinner loading-lg"></div>
</div>
{/if}

{#if (game && !game.hasStarted)}
<div class="flex flex-col items-center py-16">
  <div class="card bg-secondary text-secondary-content w-[300px]">
    {#if (game.joinedUsers.length > 8 || game.joinedUsers.length < 4 || loggedInUserName !== game.admin)}
    <div class="flex justify-center my-8">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    {/if}
    {#if (game.joinedUsers.length <= 8 && game.joinedUsers.length >= 4 && loggedInUserName === game.admin)}
    <div class="flex justify-center my-8">
      <button class="btn btn-primary">Start game</button>
    </div>
    {/if}
    <div class="divider">Joined players</div>
    {#each game.joinedUsers as user}
    <div class="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center">
      <span>{ user.name }</span>
      {#if (loggedInUserName === game.admin && loggedInUserName !== user.name)}
      <button on:click={() => deletePlayer(user.name)} class="btn btn-sm">Kick</button>
      {/if}
      {#if (loggedInUserName === user.name)}
      <button  on:click={() => deletePlayer(user.name)} class="btn btn-sm">Leave</button>
      {/if}
    </div>
    {/each}
    <div class="divider">Waiting in lobby...</div>
    {#each game.requests as user}
    <div class="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center">
      <span>{ user.name }</span>
      {#if loggedInUserName === game.admin}
      <button on:click={() => addPlayer(user.id)} class="btn btn-sm">Add</button>
      {/if}
    </div>
    {/each}
    <div class="p-2">
      <button on:click={dispatchBack} class="btn w-full btn-error">Back to menu</button>
    </div>
  </div>
</div>
{/if}
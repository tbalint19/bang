<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { defineProps } from 'vue';
  import { authorize, getGame, deleteUserFromGame } from '../api';
  import { GameSchema } from '../model';
  import { z } from 'zod';
  import { formatId } from '../util/formatId';

  const { gameId, loggedInUserName } = defineProps<{
    gameId: number
    loggedInUserName: string
  }>()

  type Game = z.infer<typeof GameSchema>

  const game = ref<Game | null>(null)

  const addPlayer = async (playerId: number): Promise<void> => {
    authorize(gameId, playerId)
  }

  const deletePlayer = async (username: string) => {
    deleteUserFromGame(gameId, username)
  }

  onMounted(() => {
    setInterval(async () => {
      const response = await getGame(gameId)
      if (!response.success) return
      game.value = response.data
    }, 500)
  })
</script>

<template>
  <div v-if="!game" class="flex justify-center">
  <div class="loading loading-spinner loading-lg"></div>
</div>

<div class="flex flex-col items-center py-16" v-if="game && !game.hasStarted">
  <div class="card bg-secondary text-secondary-content w-[300px]">
    <div class="pb-2 pt-1 opacity-25 font-extrabold text-3xl text-center">{{formatId(game.id)}}</div>
    <div v-if="game.joinedUsers.length > 8 || game.joinedUsers.length < 4 || loggedInUserName !== game.admin" class="flex justify-center my-8">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    <div v-if="game.joinedUsers.length <= 8 && game.joinedUsers.length >= 4 && loggedInUserName === game.admin" class="flex justify-center my-8">
      <button class="btn btn-primary">Start game</button>
    </div>
    <div class="divider">Joined players</div>
    <div class="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center" v-for="user of game.joinedUsers">
      <span>{{ user.name }}</span>
      <button v-if="loggedInUserName === game.admin && loggedInUserName !== user.name" @click="deletePlayer(user.name)" class="btn btn-sm">Kick</button>
      <button v-if="loggedInUserName === user.name" @click="deletePlayer(user.name)" class="btn btn-sm">Leave</button>
    </div>
    <div class="divider">Waiting in lobby...</div>
    <div class="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center" v-for="user of game.requests">
      <span>{{ user.name }}</span>
      <button v-if="loggedInUserName === game.admin" @click="addPlayer(user.id)" class="btn btn-sm">Add</button>
    </div>
    <div class="p-2">
      <button @click="$emit('back')" class="btn w-full btn-error">Back to menu</button>
    </div>
  </div>
</div>

</template>


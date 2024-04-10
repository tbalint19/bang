import { number, z } from "zod"
import { safeFetch } from "src/lib/http/safeFetch"
import { GameSchema } from "src/model"

export const signup = (name: string, password: string) => safeFetch({
  method: "POST",
  path: "/api/signup",
  data: { name, password }
}, z.object({ id: z.number() }))

export const login = (name: string, password: string) => safeFetch({
  method: "POST",
  path: "/api/login",
  data: { name, password }
}, z.object({ token: z.string() }))

export const createGame = () => safeFetch({
  method: "POST",
  path: "/api/game",
  data: {}
}, z.object({ id: z.number() }))

export const joinGame = (id: number) => safeFetch({
  method: "POST",
  path: "/api/join",
  data: { id }
}, z.object({ id: z.number() }))

export const getGame = (id: number) => safeFetch({
  method: "GET",
  path: "/api/game/" + id,
}, GameSchema)

export const authorize = (gameId: number, userId: number) => safeFetch({
  method: "POST",
  path: "/api/authorize",
  data: { gameId, userId }
}, z.object({ success: z.boolean() }))

export const deleteUserFromGame = (gameId: number, username: string) => safeFetch({
  method: "DELETE",
  path: "/api/game/" + gameId + "/" + username,
}, z.object({ success: z.boolean() }))

export const startGame = (id: number) => safeFetch({
  method: "POST",
  path: "/api/start/" + id,
  data: {}
}, z.object({ success: z.boolean() }))

export const init = () => safeFetch({
  method: "GET",
  path: "/api/init",
}, z.object({ name: z.string(), gameIds: z.number().array() }))
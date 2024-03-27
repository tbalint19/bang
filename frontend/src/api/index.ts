import { z } from "zod"
import { safeFetch } from "src/lib/http/safeFetch"

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
}, z.object({ msg: z.string() }))
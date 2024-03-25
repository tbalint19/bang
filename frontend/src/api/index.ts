import { z } from "zod"
import { safeFetch } from "src/lib/http/safeFetch"

export const signup = (name: string, password: string) => safeFetch({
  method: "POST",
  path: "/api/signup",
  data: { name, password }
}, z.object({ id: z.number() }))
import { useEffect, useState } from 'react'
import { signup, login, createGame, joinGame, init } from './api';
import Game from './components/Game';
import { formatId } from './util/formatId';

const App = () => {

  const [ loggedInUserName, setLoggedInUserName ] = useState<string | null>(null)
  const [ name, setName ] = useState("")
  const [ password, setPassword ] = useState("")
  
  const [ createdGameId, setCreatedGameId ] = useState<number | null>(null)
  const [ inputGameId, setInputGameId ] = useState("")

  const [ signupSuccess, setSignupSuccess ] = useState<boolean | null>(null)
  const [ loginSuccess, setLoginSuccess ] = useState<boolean | null>(localStorage.getItem('token') ? true : null)
  const [ joinError, setJoinError ] = useState(false)

  const [inGame, setInGame] = useState<number | null>(null)

  const [ isInitializing, setIsInitializing ] = useState(false)
  const [ gameIds, setGameIds ] = useState<number[]>([])

  const handleInitialize = async () => {
    setIsInitializing(true)
    const response = await init()
    setIsInitializing(false)
    if (!response.success) return
    setLoggedInUserName(response.data.name)
    setGameIds(response.data.gameIds)
  }

  useEffect(() => {
    if (loginSuccess)
      handleInitialize()
  }, [ ])

  const handleSignup = async() => {
    const response = await signup(name, password)
    setSignupSuccess(response.success)
  }

  const handleLogin = async() => {
    const response = await login(name, password)
    setLoginSuccess(response.success)
    if (response.success) {
      setLoggedInUserName(name)
      setName("")
      setPassword("")
      localStorage.setItem('token', response.data.token)
      handleInitialize()
    }
  }

  const handleCreate = async () => {
    const response = await createGame()
    if (!response.success) return
    setCreatedGameId(response.data.id)
  }

  const copy = () => {
    if (createdGameId) {
      navigator.clipboard.writeText(createdGameId.toString())
    }
  }

  const handleJoin = async (id: number) => {
    const response = await joinGame(id)
    if (!response.success) {
      setJoinError(true)
      return
    }
    setInGame(id)
  }
  
  const logout = async() => {
    setCreatedGameId(null)
    setLoginSuccess(null)
    setInputGameId("")
    localStorage.removeItem('token')
  }

  return  (
    <>
      {isInitializing && (
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {(!isInitializing && !inGame) && (
        <div>
          {!loginSuccess && (
            <main className="flex flex-col items-center py-16">
              <section className="card card-body w-[300px] bg-primary text-primary-content mb-8">
                <input value={name} onChange={e => setName(e.target.value)} className="input input-bordered" type="text" placeholder="Name" />
                <input value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered" type="text" placeholder="Password" />
                <button onClick={handleSignup} className="btn btn-success">Signup</button>
                <button onClick={handleLogin} className="btn btn-success">Login</button>
              </section>
            
              {signupSuccess === true && (
                <section className="alert alert-success flex justify-between w-[300px]">
                  Success!!!
                  <button onClick={() => setSignupSuccess(null)} className="btn btn-ghost">Close</button>
                </section>
              )}

              {signupSuccess === false && (
                <section className="alert alert-error flex justify-between w-[300px]">
                  Error!!!
                  <button onClick={() => setSignupSuccess(null)} className="btn btn-ghost">Close</button>
                </section>
              )}

              {loginSuccess === false && (
                <section className="alert alert-error flex justify-between w-[300px]">
                  Error!!!
                  <button onClick={() => setLoginSuccess(null)} className="btn btn-ghost">Close</button>
                </section>
              )}
              
            </main>
          )}

          {loginSuccess && (
            <main className="flex flex-col items-center py-16">
              <section className="card bg-secondary text-secondary-content w-[300px] mb-8">
                <div className="card-body ">
                  <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16" viewBox="0 0 512 512"><path fill="currentColor" d="m151.975 27.45l-36.368 42.4l207.53 178.013a321.764 321.764 0 0 1 11.275 10.14c-9.11 10.77-14.737 21.438-16.695 32.28c-1.995 11.046.054 21.91 4.777 31.83c8.896 18.685 26.413 35.06 47.666 53.413c-10.29 17.038-26.74 30.657-42.906 42.528c-10.355 7.605-12.406 15.25-10.744 24.378c1.66 9.13 8.534 19.705 18.746 27.89c10.212 8.186 23.484 13.902 36.7 14.688c13.218.786 26.327-2.924 38.306-14.24c58.46-55.225 51.443-126.42 28.968-164.854l-11.576-19.797l22.116 6.07c20.454 5.61 30.968 1.247 36.492-6.052c4.46-5.893 6.093-15.657 3.404-27.207c-9.253 2.936-20.322 5.495-32.64 5.336c-16.77-.218-35.753-5.815-53.835-21.325L151.976 27.452zm206.433 0l-88.865 76.226l42.898 36.797l82.335-70.625l-36.367-42.397zM197.943 165.095l-90.752 77.844c-18.08 15.51-37.062 21.106-53.835 21.324c-12.316.16-23.385-2.4-32.638-5.336c-2.69 11.55-1.055 21.314 3.404 27.207c5.525 7.3 16.04 11.663 36.493 6.05l22.116-6.068l-11.578 19.797c-22.475 38.433-29.49 109.63 28.97 164.854c11.978 11.316 25.087 15.026 38.304 14.24c13.217-.786 26.49-6.502 36.7-14.688c10.213-8.185 17.085-18.76 18.747-27.89c1.662-9.13-.39-16.773-10.744-24.377c-16.166-11.87-32.615-25.49-42.905-42.527c21.252-18.352 38.77-34.728 47.666-53.412c4.724-9.92 6.77-20.784 4.776-31.83c-1.958-10.842-7.585-21.51-16.695-32.28a321.82 321.82 0 0 1 11.276-10.14l53.594-45.97l-42.897-36.796zm-35.158 106.27c6.904 8.463 10.32 15.766 11.49 22.238c1.252 6.928.173 13.266-3.26 20.476c-6.01 12.628-20.036 27.048-38.69 43.527a67.038 67.038 0 0 1-1.542-6.595c-4.18-23.354 4.67-49.706 32.002-79.647zm184.813 0c27.33 29.94 36.185 56.292 32.004 79.646a67.435 67.435 0 0 1-1.543 6.597c-18.655-16.48-32.68-30.9-38.693-43.53c-3.432-7.21-4.51-13.547-3.26-20.475c1.17-6.472 4.587-13.775 11.49-22.24z"/></svg>
                  </div>
                  <div className="divider">New game</div>
                  {!createdGameId && (
                    <button onClick={handleCreate} className="btn btn-neutral">
                      Create
                    </button>
                  )}
                  {createdGameId && (
                    <div className="w-full">
                      <p className="text-center pb-2 font-bold">Game created!</p>
                      <p className="text-center pb-4">{ createdGameId }</p>
                      <div className="flex justify-center items-center gap-2">
                        <button className="btn btn-accent" onClick={copy}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2"/><path fill="currentColor" d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"/></svg>
                        </button>
                        <button onClick={() => handleJoin(createdGameId)} className="btn btn-neutral grow">Join</button>
                      </div>
                    </div>
                  )}
                  <div className="divider">Join game</div>
                  <input value={inputGameId} onChange={e => setInputGameId(e.target.value)} className="input input-bordered" placeholder="Game ID" type="text" />
                  <button onClick={() => handleJoin(+inputGameId)} className="btn btn-neutral">Join</button>
                  <div className="divider">
                    <span>
                      My games (<span className="font-bold">{loggedInUserName}</span>)
                    </span>
                  </div>
                  {gameIds.map(id => (
                    <div className="flex justify-between items-center">
                      <button className="btn btn-accent grow" onClick={() => handleJoin(id)}>
                        Join game{formatId(id)}
                      </button>
                    </div>
                  ))}
                  <div className="divider">Account</div>
                  <button onClick={logout} className="btn btn-primary">Logout</button>
                </div>
              </section>
              {joinError && (
                <section className="alert alert-error flex justify-between w-[300px]">
                  Error!!!
                  <button onClick={() => setJoinError(false)} className="btn btn-ghost">Close</button>
                </section>
              )}
            </main>
          )}
        </div>
      )}

      {(!isInitializing && inGame && loggedInUserName) && (
        <main className="flex flex-col items-center py-16">
          <Game gameId={inGame} loggedInUserName={loggedInUserName} back={() => setInGame(null)}  />
        </main>
      )}
    </>
  )
}

export default App

import { useEffect, useState } from 'react';
import { authorize, getGame, deleteUserFromGame } from '../api';
import { GameSchema } from '../model';
import { z } from 'zod';

type Game = z.infer<typeof GameSchema>

type Props = {
  gameId: number
  loggedInUserName: string
  back: () => void
}

const Game = ({ gameId, loggedInUserName, back }: Props) => {

  const [game, setGame] = useState<Game | null>(null)

  useEffect(() => {
    setInterval(async () => {
      const response = await getGame(gameId)
      if (!response.success) return
      setGame(response.data)
    }, 500)
  }, [ ])

  const addPlayer = async (playerId: number): Promise<void> => {
    authorize(gameId, playerId)
  }

  const deletePlayer = async (username: string) => {
    deleteUserFromGame(gameId, username)
  }

  return (
    <>
      {!game && (
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {(game && !game.hasStarted) && (
        <div className="flex flex-col items-center py-16">
          <div className="card bg-secondary text-secondary-content w-[300px]">
            {(game.joinedUsers.length > 8 || game.joinedUsers.length < 4 || loggedInUserName !== game.admin) && (
              <div className="flex justify-center my-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            )}
            {(game.joinedUsers.length <= 8 && game.joinedUsers.length >= 4 && loggedInUserName === game.admin) && (
              <div className="flex justify-center my-8">
                <button className="btn btn-primary">Start game</button>
              </div>
            )}
            <div className="divider">Joined players</div>
            {game.joinedUsers.map(user => (
              <div key={user.id} className="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center">
                <span>{user.name}</span>
                {(loggedInUserName === game.admin && loggedInUserName !== user.name) && (
                  <button onClick={() => deletePlayer(user.name)} className="btn btn-sm">Kick</button>
                )}
                {(loggedInUserName === user.name) && (
                  <button onClick={() => deletePlayer(user.name)} className="btn btn-sm">Leave</button>
                )}
              </div>
            ))}
            <div className="divider">Waiting in lobby...</div>
            {game.requests.map(user => (
              <div key={user.id} className="p-2 my-2 mx-3 rounded-sm bg-primary text-primary-content font-bold flex justify-between items-center">
                <span>{user.name}</span>
                {(loggedInUserName === game.admin) && (
                  <button onClick={() => addPlayer(user.id)} className="btn btn-sm">Add</button>
                )}
              </div>
            ))}
            <div className="p-2">
              <button onClick={back} className="btn w-full btn-error">Back to menu</button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default Game
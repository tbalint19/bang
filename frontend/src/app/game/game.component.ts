import { Component, Input, OnInit, Output } from '@angular/core';
import { authorize, getGame, deleteUserFromGame, startGame } from 'src/api';
import { GameSchema, UserSchema } from 'src/model';
import { number, z } from 'zod';
import { EventEmitter } from '@angular/core';
import { formatId } from 'src/util/formatId';

type Game = z.infer<typeof GameSchema>
type User = z.infer<typeof UserSchema>

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Input() gameId!: number
  @Input() loggedInUserName!: string
  @Output() back = new EventEmitter();

  game: Game | null = null

  constructor() { }
  
  ngOnInit(): void {
    setInterval(async () => {
      const response = await getGame(this.gameId)
      if (!response.success) return
      this.game = response.data
    }, 500)
  }

  formatId(id: number) {
    return formatId(id)
  }

  async addPlayer(playerId: number): Promise<void> {
    authorize(this.gameId, playerId)
  }

  async deletePlayer(username: string) {
    deleteUserFromGame(this.gameId, username)
  }
  
  async initGame() {
    startGame(this.gameId)
  }

  identifyUser(index: number, item: Omit<User, 'password'>){
    return item.id;
  }

  emitBack() {
    this.back.emit()
  }

}

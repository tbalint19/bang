import { Component, Input, OnInit, Output } from '@angular/core';
import { authorize, getGame, deleteUserFromGame, startGame, updateLife, moveCard } from 'src/api';
import { GameSchema, PlayerSchema, UserSchema } from 'src/model';
import { number, z } from 'zod';
import { EventEmitter } from '@angular/core';
import { formatId } from 'src/util/formatId';

type Game = z.infer<typeof GameSchema>
type User = z.infer<typeof UserSchema>
type Player = z.infer<typeof PlayerSchema>

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
  updatingLife = false

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

  async handleUpdateLife(value: number) {
    this.updatingLife = true
    const result = await updateLife(this.gameId ,this.loggedInUserName ,value)
    this.updatingLife = false
    if (!result.success) return
  }

  async handlePlayCard(cardId: number) {
    const result = await moveCard(this.gameId, {
      cardId,
      fromPlayer: this.loggedInUserName,
      fromPlace: "hand",
      targetPlayerName: this.loggedInUserName,
      targetPlace: "played",
      targetIndex: 0
    })
  }

  async handleInventorycard(cardId: number) {
    const result = await moveCard(this.gameId, {
      cardId,
      fromPlayer: this.loggedInUserName,
      fromPlace: "hand",
      targetPlayerName: this.loggedInUserName,
      targetPlace: "inventory",
      targetIndex: 0
    })
  }

  async throwFromInventory(cardId: number) {
    const result = await moveCard(this.gameId, {
      cardId,
      fromPlayer: this.loggedInUserName,
      fromPlace: "inventory",
      targetPlayerName: null,
      targetPlace: "used",
      targetIndex: 0
    })
  }

  async throwFromHand(cardId: number) {
    const result = await moveCard(this.gameId, {
      cardId,
      fromPlayer: this.loggedInUserName,
      fromPlace: "hand",
      targetPlayerName: null,
      targetPlace: "used",
      targetIndex: 0
    })
  }

  async throwFromPlayed(cardId: number) {
    const result = await moveCard(this.gameId, {
      cardId,
      fromPlayer: this.loggedInUserName,
      fromPlace: "played",
      targetPlayerName: null,
      targetPlace: "used",
      targetIndex: 0
    })
  }

  async drawFromUnused(cardId: number) {
    const result = await moveCard(this.gameId, {
      cardId,
      fromPlayer: null,
      fromPlace: "unused",
      targetPlayerName: this.loggedInUserName,
      targetPlace: "hand",
      targetIndex: 0
    })
  }

  identifyUser(index: number, item: Omit<User, 'password'>){
    return item.id;
  }
  
  identifyPlayer(index: number, player: Player){
    return player.name;
  }

  emitBack() {
    this.back.emit()
  }

}

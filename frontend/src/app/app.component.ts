import { Component } from '@angular/core';
import { signup, login, createGame, joinGame } from 'src/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = ''
  password = ''

  createdGameId: number | null = null
  inputGameId: string = ""

  signupSuccess: boolean | null = null
  loginSuccess: boolean | null = localStorage.getItem('token') ? true : null
  joinError: boolean = false
  inGame: boolean = false

  async handleSignup() {
    const response = await signup(this.name, this.password)
    this.signupSuccess = response.success
  }

  async handleLogin() {
    const response = await login(this.name, this.password)
    this.loginSuccess = response.success
    if (response.success) {
      this.name = ''
      this.password = ''
      localStorage.setItem('token', response.data.token)
    }
  }

  async handleCreate() {
    const response = await createGame()
    if (!response.success) return
    this.createdGameId = response.data.id
  }

  copy() {
    if (this.createdGameId) {
      navigator.clipboard.writeText(this.createdGameId.toString())
    }
  }

  async handleJoin(id: number) {
    const response = await joinGame(id)
    if (!response.success) {
      this.joinError = true
      return
    }
    this.inGame = true
  }
  
  logout () {
    localStorage.removeItem('token')
    this.loginSuccess = null
  }
}

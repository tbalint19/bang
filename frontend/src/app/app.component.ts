import { Component, OnInit } from '@angular/core';
import { signup, login, createGame, joinGame, init } from 'src/api';
import { formatId } from 'src/util/formatId';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedInUserName: string | null = null
  name = ''
  password = ''

  createdGameId: number | null = null
  inputGameId: string = ""

  signupSuccess: boolean | null = null
  loginSuccess: boolean | null = localStorage.getItem('token') ? true : null
  joinError: boolean = false
  inGame: number | null = null

  isInitializing = false
  gameIds: number[] = []

  ngOnInit(): void {
    this.handleInit()
  }

  async handleInit() {
    if (this.loginSuccess) {
      this.isInitializing = true
      const response = await init()
      this.isInitializing = false
      if (!response.success) return
      this.loggedInUserName = response.data.name
      this.gameIds = response.data.gameIds
    }
  }

  formatId(id: number) {
    return formatId(id)
  }

  async handleSignup() {
    const response = await signup(this.name, this.password)
    this.signupSuccess = response.success
  }

  async handleLogin() {
    const response = await login(this.name, this.password)
    this.loginSuccess = response.success
    if (response.success) {
      this.loggedInUserName = this.name
      this.name = ''
      this.password = ''
      localStorage.setItem('token', response.data.token)
      this.handleInit()
      
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
    this.inGame = id
  }
  
  logout () {
    this.createdGameId = null
    this.inputGameId = ""
    localStorage.removeItem('token')
    this.loginSuccess = null
  }
}

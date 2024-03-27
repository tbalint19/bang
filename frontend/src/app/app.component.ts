import { Component } from '@angular/core';
import { signup, login, createGame } from 'src/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = ''
  password = ''

  signupSuccess: boolean | null = null
  loginSuccess: boolean | null = localStorage.getItem('token') ? true : null

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
    console.log(response)
  }
  
  logout () {
    localStorage.removeItem('token')
    this.loginSuccess = null
  }
}

import { Component } from '@angular/core';
import { signup } from 'src/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = ''
  password = ''

  success: boolean | null = null

  async handleSignup() {
    const response = await signup(this.name, this.password)
    this.success = response.success
  }
}

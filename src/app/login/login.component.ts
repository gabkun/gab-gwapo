import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  message = '';
  constructor(private router: Router) {}

  async signin() {
    if (this.loginForm.invalid) {
        this.message = 'Please fill out the form correctly.';
        return;
    }

    const { username, password } = this.loginForm.value;

    try {
        const response = await axios.post('https://backend-6rk6.onrender.com/login', { username, password });
        const { id, email } = response.data;
        this.message = 'Login successful!';
        
        if (id) {
            this.router.navigate([`/todo/${id}`], { state: { id, email, username } });
        } else {
            console.log('Error: Response does not contain an id.');
        }
        
 
    } catch (error) {
        console.log('Error:', error);
    }
}
}
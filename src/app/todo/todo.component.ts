import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  id: string | null = null;
  email: string | null = null;
  username: string | null = null;
  lname: string | null = null;
  fname: string | null = null;
  todoList: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.fetchUserData(this.id);
      }
    });
  }  
  
  async fetchUserData(id: string) {
    try {
      const response = await axios.get(`https://backend-6rk6.onrender.com/todo/${id}`);
      const { email, username, lname, fname } = response.data;
      this.email = email;
      this.username = username;
      this.lname = lname;
      this.fname = fname;
      this.loadUserTodos(); // Call loadUserTodos here
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async loadUserTodos() {
    try {
      if (this.username) {
        const response = await axios.get(`https://backend-6rk6.onrender.com/todos/${this.username}`);
        this.todoList = response.data;
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  itemName = new FormControl('', Validators.required);
  added = new FormControl({ value: '', disabled: true }, Validators.required);

  async pushItemToList() {
    const itemName = this.itemName.value;
    const added = this.username; 
    console.log(itemName);
    console.log(added);
    try {
      const response = await axios.post('https://backend-6rk6.onrender.com/todo', { itemName, added });
      this.itemName.reset();
      this.added.setValue(this.username); 
      this.todoList.push(response.data); 
      console.log(response.data);
    } catch(error) {
      console.log('Error', error);
    }
  }

  async updateItem(item: any) {
    const updatedItemName = prompt('Enter the updated item name:', item.itemName);
    if (!updatedItemName) return; 
  
    try {
      const response = await axios.put(`https://backend-6rk6.onrender.com/update/${item.id}`, { itemName: updatedItemName });
      const updatedItemIndex = this.todoList.findIndex(todo => todo.id === item.id);
      if (updatedItemIndex !== -1) {
        this.todoList[updatedItemIndex].itemName = response.data.itemName; 
      }
    } catch(error) {
      console.log('Error updating item:', error);
    }
  }

  async deleteItem(itemId: any) { 
    try {
      await axios.delete(`https://backend-6rk6.onrender.com/todo/${itemId}`);
      this.todoList = this.todoList.filter(item => item.id !== itemId);
    } catch(error) {
      console.log('Error deleting item:', error);
    }
  }

  async updateUser() {
    const updatedEmail = prompt('Enter the updated email:', this.email ?? '');
    const updatedUsername = prompt('Enter the updated username:', this.username ?? '');
    const updatedFname = prompt('Enter the updated first name:', this.fname ?? '');
    const updatedLname = prompt('Enter the updated last name:', this.lname ?? '');

    if (!updatedEmail || !updatedUsername || !updatedFname || !updatedLname) return; 

    try {
      const response = await axios.put(`https://backend-6rk6.onrender.com/user/${this.id}`, { 
        email: updatedEmail, 
        username: updatedUsername,
        fname: updatedFname,
        lname: updatedLname
      });
      this.email = response.data.email;
      this.username = response.data.username;
      this.fname = response.data.fname;
      this.lname = response.data.lname;
    } catch(error) {
      console.log('Error updating user:', error);
    }
  }

  async deleteUser() {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`https://backend-6rk6.onrender.com/user/${this.id}`);
      await axios.delete(`https://backend-6rk6.onrender.com/todos/${this.username}`); 
      this.router.navigate(['/']);
    } catch(error) {
      console.log('Error deleting user:', error);
    }
  }
}
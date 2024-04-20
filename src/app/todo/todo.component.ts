import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import axios from 'axios';


@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  itemName = new FormControl('', Validators.required);
  todoList: any[] = [];

  async pushItemToList(){
    const itemName = this.itemName.value;
    console.log(itemName);
    try {
      const response = await axios.post('http://localhost:3069/todo', { itemName });
      this.itemName.reset();
      this.todoList.push(response.data); // Assuming your response returns the newly created item
      console.log(response.data);
    } catch(error) {
      console.log('Error', error);
    }
  }
}

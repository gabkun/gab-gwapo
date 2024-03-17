import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todoItem = new FormControl("");

  todoList: string[] = []

  pushItemToList(){
    this.todoList.push(this.todoItem.value as string)

    this.todoItem.setValue("")
  }
}
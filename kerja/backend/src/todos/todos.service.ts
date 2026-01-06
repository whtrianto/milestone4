import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private nextId = 1;

  findAll(search?: string): Todo[] {
    if (!search) {
      return this.todos;
    }
    
    const searchLower = search.toLowerCase();
    return this.todos.filter(todo => 
      todo.title.toLowerCase().includes(searchLower)
    );
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title: createTodoDto.title,
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: number): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      return null;
    }
    todo.completed = !todo.completed;
    return todo;
  }
}


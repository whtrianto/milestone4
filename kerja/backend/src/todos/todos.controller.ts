import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.todosService.findAll(search);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Patch(':id')
  toggle(@Param('id', ParseIntPipe) id: number) {
    const todo = this.todosService.toggle(id);
    if (!todo) {
      return { error: 'Todo not found' };
    }
    return todo;
  }
}


import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TodosModule, AuthModule],
})
export class AppModule {}


import { Module } from '@nestjs/common';
import { BooksModule } from './books/book.module';
import { CustomerModule } from './customers/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BooksModule,
    CustomerModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '1234',
        database: 'postgres',
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

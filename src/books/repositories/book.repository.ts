import { Injectable, Logger } from '@nestjs/common';
import { BookRequestDto } from '../dtos/book-request.dto';
import { DataSource } from 'typeorm';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookRepository {
  constructor(private readonly dataSource: DataSource) {}
  async getBooks(params: BookRequestDto, queryRunner) {
    try {
      return await this.dataSource.query(`
      SELECT * FROM books`, [], queryRunner);
    } catch (error) {
      Logger.error('BookRepository.getBooks', error)
      throw error;
    }
  }

  async createNewBook(payload, queryRunner) {
    try {
      return await this.dataSource.query(
        `
        INSERT INTO books (title, author)
        VALUES ($1, $2);
        `,
        [payload.title, payload.author],
        queryRunner
      );
    } catch (error) {
      Logger.error('BookRepository.createNewBook', error);
      throw error;
    }
  }
  async getByNameAndAuthor(title: string, author: string, queryRunner) {
    try {
      return await this.dataSource.query(
        `
        SELECT * FROM books as b WHERE b.title = $1 AND b.author = $2
        `,
        [title, author],
        queryRunner
      );
    } catch (error) {
      Logger.error('BookRepository.createNewBook', error);
      throw error;
    }
  }
}

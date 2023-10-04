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

  async getBookById(book_id: number, queryRunner) {
    try {
      return await this.dataSource.query(`
      SELECT * FROM books WHERE id = $1`, [book_id], queryRunner);
    } catch (error) {
      Logger.error('BookRepository.getBookById', error)
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

  async checkBookByStatus(book_id: number, status: number, queryRunner) {
    try {
      return await this.dataSource.query(
        `
        SELECT * FROM books as b WHERE b.id = $1 AND b.status = $2
        `,
        [book_id, status],
        queryRunner
      );
    } catch (error) {
      Logger.error('BookRepository.createNewBook', error);
      throw error;
    }
  }
  async borrowBook(book_id: number, customer_id: number, status: number, price: number, queryRunner) {
    try {
      return await this.dataSource.query(
        `
        INSERT INTO customers_books (book_id, customer_id, status, created_at, price)
        VALUES ($1, $2, $3, $4, $5);
        `,
        [book_id, customer_id, status, new Date(), price],
        queryRunner
      );
    } catch (error) {
      Logger.error('BookRepository.borrowBook', error);
      throw error;
    }
  }
  async updateBookStatus(book_id, status: number, queryRunner) {
    try {
      return await this.dataSource.query(
        `
        UPDATE books SET status = $1 WHERE id = $2
        `,
        [status, book_id],
        queryRunner
      );
    } catch (error) {
      Logger.error('BookRepository.updateBook', error);
      throw error;
    }
  }
  async getBorrowedBooks(status, limit, page, search) {
    try {
      let parameters = [limit, Number(page) * Number(limit)];
      let query = `
      SELECT 
        cb.id,
        cb.customer_id,
        (SELECT c_.name FROM customers AS c_ WHERE c_.id = cb.customer_id) as customer_name,
        cb.status,
        cb.created_at as time
      FROM customers_books as cb`; 
      if (status) {
        query += ` WHERE cb.status = $3 `
        parameters.push(status)
      }
      query += ` ORDER BY cb.id desc LIMIT $1 OFFSET $2 `;
      return await this.dataSource.query(query, parameters)
    } catch (error) {
      Logger.error('BookRepository.getBorrowedBooks', error);
      throw error;
    }
  }
}

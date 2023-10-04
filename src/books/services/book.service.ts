import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRequestDto } from '../dtos/book-request.dto';
import { CreateBookRequestDto } from '../dtos/create-book-request.dto';
import { BookRepository } from '../repositories/book.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository, private readonly dataSource: DataSource) {}

  getBooks(params: BookRequestDto) {
    try {
      console.log(params);
      const queryRunner = this.dataSource.createQueryRunner('slave');
      return this.bookRepository.getBooks(params, queryRunner);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createNewBook(payload: CreateBookRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner('master');
    try {
      // check existing books
      queryRunner.startTransaction()
      await this._checkByNameAndAuthor(payload.title, payload.author, queryRunner)
      await this.bookRepository.createNewBook(payload, queryRunner);
      queryRunner.commitTransaction();
      return payload;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    }
  }
  async borrowBook(payload) {
    const queryRunner = this.dataSource.createQueryRunner('master');
    try {
      queryRunner.startTransaction()
      // check avaibility 
      const book = await this._checkBorrowBook(payload.book_id, 1, queryRunner);
      await this.bookRepository.borrowBook(payload.book_id, payload.customer_id, 1, Number(book.price), queryRunner);
      await this.bookRepository.updateBookStatus(payload.book_id, 0, queryRunner);
      queryRunner.commitTransaction()
      return {
        status: 'success',
        message: 'successfully borrow book'
      }
    } catch (error) {
      queryRunner.rollbackTransaction()
      throw error;
    }
  }
  async returnBook(payload) {
    const queryRunner = this.dataSource.createQueryRunner('master');
    try {
      queryRunner.startTransaction()
      // check avaibility 
      const book = await this._checkReturnBook(payload.customer_id, payload.book_id, 0, queryRunner);
      console.log(book);
      await this.bookRepository.borrowBook(payload.book_id, payload.customer_id, 0, 0, queryRunner);
      await this.bookRepository.updateBookStatus(payload.book_id, 1, queryRunner)
      queryRunner.commitTransaction()
      return {
        status: 'success',
        message: 'successfully borrow book'
      }
    } catch (error) {
      queryRunner.rollbackTransaction()
      throw error;
    }
  }
  async getBorrowedBooks(params) {
    const books = await this.bookRepository.getBorrowedBooks(params.status, params.limit, params.page, params.search)
    console.log(books);
    
    return books;
  }
  private async _checkByNameAndAuthor(title: string, author: string, queryRunner) {
    const check = await this.bookRepository.getByNameAndAuthor(title, author, queryRunner);
    if (check.length > 0) throw new BadRequestException('Book already exist')
  }
  private async _checkBorrowBook(book_id: number, status: number, queryRunner) {
    const [book] = await this.bookRepository.getBookById(book_id, queryRunner);
    if (book.length === 0) throw new BadRequestException('Book is not provided')
    const [data] = await this.bookRepository.checkBookByStatus(book_id, status, queryRunner);
    if (!data) throw new BadRequestException('Book not available')
    return book;
  }
  private async _checkReturnBook(customer_id: number, book_id: number, status: number, queryRunner) {
    const book = await this.bookRepository.getBookById(book_id, queryRunner);
    if (book.length === 0) throw new BadRequestException('Book is not provided')
    const [data] = await this.bookRepository.checkBookByStatus(book_id, status, queryRunner);
    console.log(data);
    
    if (data && data.status == 0) {
      return book;
    }
    throw new BadRequestException('Book not available')
  }
}

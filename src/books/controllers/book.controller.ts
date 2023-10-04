import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { BookRequestDto } from '../dtos/book-request.dto';
import { CreateBookRequestDto } from '../dtos/create-book-request.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('list')
  getBooks(@Query() params: BookRequestDto) {
    
    return this.bookService.getBooks(params);
  }
  @Post('create')
  inseretBook(@Body() payload: CreateBookRequestDto) {
    return this.bookService.createNewBook(payload);
  }
  @Post('borrow')
  borrowBook(@Body() payload) {
    return this.bookService.borrowBook(payload)
  }
  @Post('return')
  returnBook(@Body() payload) {
    return this.bookService.returnBook(payload)
  }
  @Get('list-borrowed')
  listingBorrowed(@Query() params) {
    return this.bookService.getBorrowedBooks(params)
  }
}

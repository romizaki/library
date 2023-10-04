import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(private readonly dataSource: DataSource) {}
  async getCustomers(queryRunner) {
    try {
      return await this.dataSource.query(`
      SELECT * FROM customers`, [], queryRunner);
    } catch (error) {
      Logger.error('CustomerRepository.getCustomers', error)
      throw error;
    }
  }

  async createNewCustomer(payload, queryRunner) {
    try {
      return await this.dataSource.query(
        `
        INSERT INTO customers (name, balance)
        VALUES ($1, $2);
        `,
        [payload.name, payload.balance],
        queryRunner
      );
    } catch (error) {
      Logger.error('CustomerRepository.createNewCustomer', error);
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

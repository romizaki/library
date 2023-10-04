import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomerServices {
  constructor(private customerRepository: CustomerRepository, private dataSource: DataSource) {}
  async getCustomers() {
    try {
      const queryRunner = await this.dataSource.createQueryRunner('master');
      return this.customerRepository.getCustomers(queryRunner);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async createCustomer(payload) {
    try {
      const queryRunner = await this.dataSource.createQueryRunner('master');
      return this.customerRepository.createNewCustomer(payload, queryRunner)
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

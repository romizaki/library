import { Controller, Get } from '@nestjs/common';
import { CustomerServices } from '../services/customer.services';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerServices) {}

  @Get('customers')
  getBooks() {
    return this.customerService.getCustomers();
  }
}

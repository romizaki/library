import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerServices } from '../services/customer.services';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerServices) {}

  @Get('list')
  getCustomers() {
    return this.customerService.getCustomers();
  }
  @Post('create')
  createCustomer(@Body() payload) {
    return this.customerService.createCustomer(payload)
  }
}

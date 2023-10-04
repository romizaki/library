import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerServices } from './services/customer.services';
import { CustomerRepository } from './repositories/customer.repository';

@Module({
  controllers: [CustomerController],
  providers: [CustomerServices, CustomerRepository],
})
export class CustomerModule {}
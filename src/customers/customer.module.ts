import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerServices } from './services/customer.services';

@Module({
  controllers: [CustomerController],
  providers: [CustomerServices],
})
export class CustomerModule {}
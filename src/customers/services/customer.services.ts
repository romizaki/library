import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerServices {
  getCustomers() {
    try {
      const customers = [
        { name: 'customer 1' },
        { name: 'customer 2' },
        { name: 'customer 3' },
      ];

      return customers;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

import { Module } from '@nestjs/common';
import { Customer } from './customer.model';

@Module({
  providers: [Customer],
  exports: [Customer],
})
export class CustomerModule {}

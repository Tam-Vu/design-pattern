import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserCreator } from './user-creator.abstract';
import { AdminCreator } from './admin-creator';
import { StaffCreator } from './staff-creator';
import { CustomerCreator } from './customer-creator';
import { ApplicationUser } from './application-user.abstract';
import { User } from './user.interface';
import { AdminDecorator } from './admin-decorator';
import { StaffDecorator } from './staff-decorator';
import { CustomerDecorator } from './customer-decorator';

@Injectable()
export class UserFactory {
  static createUser(userData: Partial<ApplicationUser>): ApplicationUser {
    switch (userData.role) {
      case Role.ADMIN:
        return new AdminCreator().createUser(userData);
      case Role.STAFF:
        return new StaffCreator().createUser(userData);
      case Role.CUSTOMER:
      default:
        return new CustomerCreator().createUser(userData);
    }
  }

  static decorateUser(user: User): User {
    switch (user.role) {
      case Role.ADMIN:
        return new AdminDecorator(user);
      case Role.STAFF:
        return new StaffDecorator(user);
      case Role.CUSTOMER:
      default:
        return new CustomerDecorator(user);
    }
  }
}
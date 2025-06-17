import { Injectable } from '@nestjs/common';
import { Gender, Role } from '@prisma/client';
import { ApplicationUser } from '../models/application-user';
import { Admin } from '../models/admin';
import { Customer } from '../models/customer';
import { Staff } from '../models/staff';

@Injectable()
export class UserFactory {
  createUser(type: Role, data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    birthday: Date;
    gender: Gender;
    avatarUrl: string;
  }): ApplicationUser {
    switch (type) {
      case Role.CUSTOMER:
        return new Customer(data);
      case Role.STAFF:
        return new Staff(data);
      case Role.ADMIN:
      case Role.MANAGER:
        return new Admin(data);
      default:
        throw new Error(`User type ${type} not supported.`);
    }
  }
}

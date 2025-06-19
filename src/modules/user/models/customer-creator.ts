import { UserCreator } from './user-creator.abstract';
import { Customer } from './customer';
import { ApplicationUser } from './application-user.abstract';

export class CustomerCreator extends UserCreator {
  createUser(userData: Partial<ApplicationUser>): ApplicationUser {
    return new Customer(userData);
  }
}

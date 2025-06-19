import { UserCreator } from './user-creator.abstract';
import { Admin } from './admin';
import { ApplicationUser } from './application-user.abstract';

export class AdminCreator extends UserCreator {
  createUser(userData: Partial<ApplicationUser>): ApplicationUser {
    return new Admin(userData);
  }
}

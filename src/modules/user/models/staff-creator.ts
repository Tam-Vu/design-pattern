import { UserCreator } from './user-creator.abstract';
import { Staff } from './staff';
import { ApplicationUser } from './application-user.abstract';

export class StaffCreator extends UserCreator {
  createUser(userData: Partial<ApplicationUser>): ApplicationUser {
    return new Staff(userData);
  }
}

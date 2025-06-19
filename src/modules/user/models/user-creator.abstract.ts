import { ApplicationUser } from './application-user.abstract';

export abstract class UserCreator {
  abstract createUser(userData: any): ApplicationUser;
}

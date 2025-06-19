import { Role } from '@prisma/client';
import { User } from './user.interface';

export abstract class UserDecorator implements User {
  protected user: User;

  constructor(user: User) {
    this.user = user;
  }

  get id(): string {
    return this.user.id;
  }

  get email(): string {
    return this.user.email;
  }

  get fullName(): string {
    return this.user.fullName;
  }

  get role(): Role {
    return this.user.role;
  }

  async signIn(password: string): Promise<boolean> {
    return this.user.signIn(password);
  }

  abstract getPermissions(): string[];
}

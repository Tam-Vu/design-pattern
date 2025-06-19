import { Role } from '@prisma/client';
import { ApplicationUser } from './application-user.abstract';

export class Customer extends ApplicationUser {
  constructor(userData: Partial<ApplicationUser>) {
    super(userData);
    this.role = Role.CUSTOMER;
  }

  getPermissions(): string[] {
    return [
      'user:read-self',
      'user:update-self',
      'product:read',
      'order:create',
      'order:read-self',
      'order:cancel-self',
      'cart:read',
      'cart:update',
      'review:create',
      'review:read'
    ];
  }
}

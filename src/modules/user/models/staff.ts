import { Role } from '@prisma/client';
import { ApplicationUser } from './application-user.abstract';

export class Staff extends ApplicationUser {
  constructor(userData: Partial<ApplicationUser>) {
    super(userData);
    this.role = Role.STAFF;
  }

  getPermissions(): string[] {
    return [
      'user:read',
      'product:read',
      'product:update',
      'order:read',
      'order:update',
      'category:read'
    ];
  }
}

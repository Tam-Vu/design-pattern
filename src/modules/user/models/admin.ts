import { Role } from '@prisma/client';
import { ApplicationUser } from './application-user.abstract';

export class Admin extends ApplicationUser {
  constructor(userData: Partial<ApplicationUser>) {
    super(userData);
    this.role = Role.ADMIN;
  }

  getPermissions(): string[] {
    return [
      'user:create',
      'user:read',
      'user:update',
      'user:delete',
      'user:enable',
      'user:disable',
      'product:create',
      'product:read',
      'product:update',
      'product:delete',
      'order:read',
      'order:update',
      'category:create',
      'category:read',
      'category:update',
      'category:delete'
    ];
  }
}

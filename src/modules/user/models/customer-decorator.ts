import { User } from './user.interface';
import { UserDecorator } from './user-decorator.abstract';

export class CustomerDecorator extends UserDecorator {
  constructor(user: User) {
    super(user);
  }

  getPermissions(): string[] {
    const basePermissions = this.user.getPermissions();
    return [
      ...basePermissions,
      'wishlist:read',
      'wishlist:update',
      'profile:read',
      'profile:update',
      'notification:read'
    ];
  }
}

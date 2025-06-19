import { User } from './user.interface';
import { UserDecorator } from './user-decorator.abstract';

export class StaffDecorator extends UserDecorator {
  constructor(user: User) {
    super(user);
  }

  getPermissions(): string[] {
    const basePermissions = this.user.getPermissions();
    return [
      ...basePermissions,
      'inventory:read',
      'inventory:update',
      'report:basic'
    ];
  }
}

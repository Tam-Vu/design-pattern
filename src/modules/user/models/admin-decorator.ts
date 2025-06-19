import { User } from './user.interface';
import { UserDecorator } from './user-decorator.abstract';

export class AdminDecorator extends UserDecorator {
  constructor(user: User) {
    super(user);
  }

  getPermissions(): string[] {
    const basePermissions = this.user.getPermissions();
    return [
      ...basePermissions,
      'system:config',
      'system:logs',
      'user:impersonate',
      'analytics:view',
      'analytics:export'
    ];
  }
}

import { Gender, Role } from '@prisma/client';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';

export abstract class ApplicationUser implements User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  gender: Gender;
  birthday: Date;
  avatarUrl: string;
  isDisabled: boolean;
  password: string;

  constructor(userData: Partial<ApplicationUser>) {
    this.id = userData.id || '';
    this.email = userData.email || '';
    this.phone = userData.phone;
    this.fullName = userData.fullName || '';
    this.role = userData.role || Role.CUSTOMER;
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
    this.gender = userData.gender || Gender.MALE;
    this.birthday = userData.birthday || new Date();
    this.avatarUrl = userData.avatarUrl || '';
    this.isDisabled = userData.isDisabled || false;
    this.password = userData.password || '';
  }

  async signIn(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  abstract getPermissions(): string[];
}

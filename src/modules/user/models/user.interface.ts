import { Gender, Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  gender?: Gender;
  birthday?: Date;
  avatarUrl?: string;
  isDisabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  signIn(password: string): Promise<boolean>;
  getPermissions(): string[];
}

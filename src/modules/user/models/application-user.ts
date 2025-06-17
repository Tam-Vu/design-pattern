import { Gender, Role } from '@prisma/client';

export abstract class ApplicationUser {
  username: string;
  password: string;
  email: string;
  phone?: string;
  fullName: string;
  birthday: Date;
  gender: Gender;
  avatarUrl: string;
  
  constructor(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    birthday: Date;
    gender: Gender;
    avatarUrl: string;
  }) {
    this.email = data.email;
    this.password = data.password;
    this.fullName = data.fullName;
    this.phone = data.phone;
    this.birthday = data.birthday;
    this.gender = data.gender;
    this.avatarUrl = data.avatarUrl;
  }
  
  abstract getPrismaCreateData(): any;
}

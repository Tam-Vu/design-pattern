import { Gender } from '@prisma/client';
import { ApplicationUser } from './application-user';

export class Staff extends ApplicationUser {
  staffId?: string;
  position: string = 'STAFF';
  
  constructor(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    birthday: Date;
    gender: Gender;
    avatarUrl: string;
  }) {
    super(data);
  }
  
  getPrismaCreateData() {
    return {
      email: this.email,
      password: this.password,
      full_name: this.fullName,
      phone: this.phone,
      birthday: this.birthday,
      gender: this.gender,
      avatar_url: this.avatarUrl,
      role: 'STAFF'
    };
  }
}

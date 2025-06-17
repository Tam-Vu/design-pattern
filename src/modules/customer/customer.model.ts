import { Injectable } from '@nestjs/common';
import { Observer } from 'src/common/interfaces/observer.interface';

@Injectable()
export class Customer implements Observer {
  constructor(private readonly userId: string) {}
  
  update(): void {
    console.log(`Notifying customer ${this.userId} about changes`);
    // Here you would implement actual notification logic
    // such as sending an email, push notification, etc.
  }
}

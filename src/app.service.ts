import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Mechanical Keyboard Shop Backend is running :) !!';
  }
}

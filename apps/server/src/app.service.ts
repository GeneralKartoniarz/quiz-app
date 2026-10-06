import { Injectable } from '@nestjs/common';
import { QuizQuestion } from '@quiz-app/types';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

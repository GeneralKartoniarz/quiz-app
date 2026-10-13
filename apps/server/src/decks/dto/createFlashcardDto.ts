import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateFlashcardPayload } from '@quiz-app/shared-types';

export class CreateFlashcardDto implements CreateFlashcardPayload {
  @IsString()
  @IsNotEmpty()
  frontText: string;

  @IsString()
  @IsNotEmpty()
  backText: string;

  @IsString()
  @IsOptional()
  hint?: string;
}
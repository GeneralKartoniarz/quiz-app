import { IsOptional, IsString } from 'class-validator';
import { UpdateFlashcardPayload } from '@quiz-app/shared-types';

export class UpdateFlashcardDto implements UpdateFlashcardPayload {
  @IsString()
  @IsOptional()
  frontText?: string;

  @IsString()
  @IsOptional()
  backText?: string;

  @IsString()
  @IsOptional()
  hint?: string;
}
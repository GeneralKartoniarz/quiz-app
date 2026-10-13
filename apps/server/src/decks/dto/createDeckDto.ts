import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDeckPayload } from '@quiz-app/shared-types';
import { CreateFlashcardDto } from './createFlashcardDto';

export class CreateDeckDto implements CreateDeckPayload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashcardDto)
  flashcards?: CreateFlashcardDto[];
}
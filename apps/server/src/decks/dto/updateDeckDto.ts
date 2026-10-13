import { PartialType } from '@nestjs/mapped-types';
import { CreateDeckDto } from './createDeckDto';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {}
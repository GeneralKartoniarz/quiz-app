import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DecksService } from './decksService';
import { CreateDeckDto } from './dto/createDeckDto';
import { UpdateDeckDto } from './dto/updateDeckDto';

@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDeckDto: CreateDeckDto) {
    return this.decksService.create(createDeckDto);
  }

  @Get()
  findAll() {
    return this.decksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(id, updateDeckDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.decksService.remove(id);
  }
}
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
  UseGuards,
} from '@nestjs/common';
import { DecksService } from './decksService';
import { CreateDeckDto } from './dto/createDeckDto';
import { UpdateDeckDto } from './dto/updateDeckDto';
import { CreateFlashcardDto } from './dto/createFlashcardDto';
import { UpdateFlashcardDto } from './dto/updateFlashcardDto';
import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';

@Controller('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') authorId: string,
    @Body() createDeckDto: CreateDeckDto,
  ) {
    return this.decksService.create(authorId, createDeckDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyDecks(@CurrentUser('id') userId: string) {
    return this.decksService.findUserDecks(userId);
  }

  @Get()
  findPublicDecks() {
    return this.decksService.findPublicDecks();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.decksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateDeckDto: UpdateDeckDto,
  ) {
    return this.decksService.update(id, userId, updateDeckDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.decksService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/flashcards')
  @HttpCode(HttpStatus.CREATED)
  addFlashcard(
    @Param('id') deckId: string,
    @CurrentUser('id') userId: string,
    @Body() createFlashcardDto: CreateFlashcardDto,
  ) {
    return this.decksService.addFlashcard(deckId, userId, createFlashcardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':deckId/flashcards/:cardId')
  updateFlashcard(
    @Param('deckId') deckId: string,
    @Param('cardId') cardId: string,
    @CurrentUser('id') userId: string,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ) {
    return this.decksService.updateFlashcard(
      deckId,
      cardId,
      userId,
      updateFlashcardDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':deckId/flashcards/:cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFlashcard(
    @Param('deckId') deckId: string,
    @Param('cardId') cardId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.decksService.removeFlashcard(deckId, cardId, userId);
  }
}
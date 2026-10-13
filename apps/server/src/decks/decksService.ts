import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto } from './dto/createDeckDto';
import { UpdateDeckDto } from './dto/updateDeckDto';
import { CreateFlashcardDto } from './dto/createFlashcardDto';
import { UpdateFlashcardDto } from './dto/updateFlashcardDto';


@Injectable()
export class DecksService {
  constructor(private readonly prisma: PrismaService) {}


  async create(authorId: string, createDeckDto: CreateDeckDto) {
    const { flashcards, ...deckData } = createDeckDto;

    return this.prisma.deck.create({
      data: {
        ...deckData,
        authorId,
        isPublic: deckData.isPublic ?? false,
        flashcards: flashcards && flashcards.length > 0
          ? {
              create: flashcards.map((card) => ({
                frontText: card.frontText,
                backText: card.backText,
                hint: card.hint,
              })),
            }
          : undefined,
      },
      include: {
        flashcards: true,
      },
    });
  }

  async findPublicDecks() {
    return this.prisma.deck.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: {
            flashcards: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findUserDecks(userId: string) {
    return this.prisma.deck.findMany({
      where: {
        authorId: userId,
      },
      include: {
        _count: {
          select: {
            flashcards: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
      include: {
        flashcards: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!deck) {
      throw new NotFoundException('Talia o podanym identyfikatorze nie istnieje');
    }

    return deck;
  }

  async update(id: string, userId: string, updateDeckDto: UpdateDeckDto) {
    const deck = await this.findOne(id);

    if (deck.authorId !== userId) {
      throw new ForbiddenException('Brak uprawnien do modyfikacji tej talii');
    }

    return this.prisma.deck.update({
      where: { id },
      data: {
        title: updateDeckDto.title,
        description: updateDeckDto.description,
        isPublic: updateDeckDto.isPublic,
      },
      include: {
        flashcards: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const deck = await this.findOne(id);

    if (deck.authorId !== userId) {
      throw new ForbiddenException('Brak uprawnien do usuniecia tej talii');
    }

    return this.prisma.deck.delete({
      where: { id },
    });
  }

  async addFlashcard(
    deckId: string,
    userId: string,
    createFlashcardDto: CreateFlashcardDto,
  ) {
    const deck = await this.findOne(deckId);

    if (deck.authorId !== userId) {
      throw new ForbiddenException('Brak uprawnien do dodawania fiszek w tej talii');
    }

    return this.prisma.flashcard.create({
      data: {
        frontText: createFlashcardDto.frontText,
        backText: createFlashcardDto.backText,
        hint: createFlashcardDto.hint,
        deckId,
      },
    });
  }

  async updateFlashcard(
    deckId: string,
    flashcardId: string,
    userId: string,
    updateFlashcardDto: UpdateFlashcardDto,
  ) {
    const deck = await this.findOne(deckId);

    if (deck.authorId !== userId) {
      throw new ForbiddenException('Brak uprawnien do edycji fiszek w tej talii');
    }

    const card = await this.prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        deckId,
      },
    });

    if (!card) {
      throw new NotFoundException('Fiszka nie istnieje w wybranej talii');
    }

    return this.prisma.flashcard.update({
      where: { id: flashcardId },
      data: {
        frontText: updateFlashcardDto.frontText,
        backText: updateFlashcardDto.backText,
        hint: updateFlashcardDto.hint,
      },
    });
  }

  async removeFlashcard(deckId: string, flashcardId: string, userId: string) {
    const deck = await this.findOne(deckId);

    if (deck.authorId !== userId) {
      throw new ForbiddenException('Brak uprawnien do usuwania fiszek z tej talii');
    }

    const card = await this.prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        deckId,
      },
    });

    if (!card) {
      throw new NotFoundException('Fiszka nie istnieje w wybranej talii');
    }

    return this.prisma.flashcard.delete({
      where: { id: flashcardId },
    });
  }
}
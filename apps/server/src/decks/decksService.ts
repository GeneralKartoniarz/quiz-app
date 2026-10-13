import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto } from './dto/createDeckDto';
import { UpdateDeckDto } from './dto/updateDeckDto';

@Injectable()
export class DecksService {
  constructor(private readonly prisma: PrismaService) {}

  //dobra to by wypadało skomentować
  //tworzy talie
  async create(createDeckDto: CreateDeckDto) {
    const { flashcards, ...deckData } = createDeckDto;

    return this.prisma.deck.create({
      data: {
        ...deckData,
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
  //wypisuje wszystkie talie TODO wyszukiwanie po ocenach TODO system ocen?? idk
  async findAll() {
    return this.prisma.deck.findMany({
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
  //wyszukuje jedną talie
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
      throw new NotFoundException(`Talia o podanym identyfikatorze nie istnieje`);
    }

    return deck;
  }
  //update talii
  async update(id: string, updateDeckDto: UpdateDeckDto) {
    await this.findOne(id);

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
  //usuwanie talii
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.deck.delete({
      where: { id },
    });
  }
}
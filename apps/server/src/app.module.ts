import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DecksModule } from './decks/decksModule';
import { AuthModule } from './auth/authModule';

@Module({
  imports: [
    PrismaModule,
    DecksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
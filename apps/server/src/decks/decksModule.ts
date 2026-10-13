import { Module } from '@nestjs/common';
import { DecksService } from './decksService';
import { DecksController } from './decksController';

@Module({
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
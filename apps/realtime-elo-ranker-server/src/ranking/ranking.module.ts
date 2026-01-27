import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/player.entity';
import { RankingService } from './ranking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player])], // Besoin du repo pour l'init
  providers: [RankingService],
  exports: [RankingService], // Important : On l'exporte pour PlayersService
})
export class RankingModule {}
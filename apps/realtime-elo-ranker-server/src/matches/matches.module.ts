import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../players/player.entity';
import { RankingModule } from '../ranking/ranking.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]), // Pour accéder à la table Players
    RankingModule, // Pour accéder aux calculs Elo
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
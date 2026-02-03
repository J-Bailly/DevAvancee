import { Module } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { MatchesModule } from '../matches/matches.module';
import { RankingModule } from '../ranking/ranking.module';

@Module({
  imports: [
    MatchesModule,
    RankingModule,
  ],
  providers: [SimulatorService],
})
export class SimulatorModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayersModule } from './players/players.module';
import { RankingModule } from './ranking/ranking.module'; 
import { MatchesModule } from './matches/matches.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SimulatorService } from './simulator/simulator.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'elo-ranker.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PlayersModule,
    RankingModule, 
    MatchesModule,
    ScheduleModule.forRoot(),
    SimulatorService,
  ],
})
export class AppModule {}
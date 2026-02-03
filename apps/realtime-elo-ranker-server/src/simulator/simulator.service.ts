import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { MatchesService } from '../matches/matches.service';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class SimulatorService {
  private readonly logger = new Logger(SimulatorService.name);

  constructor(
    private readonly matchesService: MatchesService,
    private readonly rankingService: RankingService,
  ) {}

  @Interval((2000))
  async playAutomaticMatch() {
    const players = this.rankingService.getRanking();

    if (players.length < 2) return;

    const p1Index = Math.floor(Math.random() * players.length);
    let p2Index = Math.floor(Math.random() * players.length);
    while (p1Index === p2Index) {
      p2Index = Math.floor(Math.random() * players.length);
    }

    try {
      await this.matchesService.resolveMatch({
        winner: players[p1Index].id,
        loser: players[p2Index].id,
        draw: Math.random() < 0.1,
      });
      // this.logger.log(`⚔️ Match Auto : ${players[p1Index].id} vs ${players[p2Index].id}`);
    } catch (e) {
    }
  }
}
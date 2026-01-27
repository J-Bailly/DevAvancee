import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../players/player.entity'; // Ajuste le chemin si besoin
import { Repository } from 'typeorm';

@Injectable()
export class RankingService implements OnModuleInit {
  // Le fameux Singleton Cache
  private rankingCache: Player[] = [];

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  // 1. Initialisation du cache au démarrage
  async onModuleInit() {
    this.rankingCache = await this.playerRepository.find({
      order: { rank: 'DESC' },
    });
    console.log(`Ranking initialized with ${this.rankingCache.length} players.`);
  }

  // 2. Lecture du cache (Rapide !)
  getRanking(): Player[] {
    return this.rankingCache;
  }

  // 3. Écouteur d'événement : Quand un joueur change, on met à jour le cache
  @OnEvent('player.updated')
  handlePlayerUpdate(player: Player) {
    // On cherche si le joueur est déjà là
    const index = this.rankingCache.findIndex((p) => p.id === player.id);
    
    if (index !== -1) {
      // Mise à jour
      this.rankingCache[index] = player;
    } else {
      // Nouveau joueur
      this.rankingCache.push(player);
    }
    
    // On re-trie toujours
    this.rankingCache.sort((a, b) => b.rank - a.rank);
  }

  // 4. Logique Métier PURE : Calcul Elo
  calculateMatchResult(winner: Player, loser: Player, isDraw: boolean): { newRankWinner: number; newRankLoser: number } {
    const K = 32;

    const probWinner = 1 / (1 + Math.pow(10, (loser.rank - winner.rank) / 400));
    const probLoser = 1 / (1 + Math.pow(10, (winner.rank - loser.rank) / 400));

    const actualScoreWinner = isDraw ? 0.5 : 1;
    const actualScoreLoser = isDraw ? 0.5 : 0;

    const newRankWinner = Math.round(winner.rank + K * (actualScoreWinner - probWinner));
    const newRankLoser = Math.round(loser.rank + K * (actualScoreLoser - probLoser));

    return { newRankWinner, newRankLoser };
  }

  // Helper pour calculer la moyenne initiale (Logique métier)
  calculateInitialRank(): number {
    if (this.rankingCache.length === 0) return 1000;
    
    let total = 0;
    for (const p of this.rankingCache) {
      total += p.rank;
    }
    return Math.round(total / this.rankingCache.length);
  }
}
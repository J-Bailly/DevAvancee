import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayersService {
  // Cache mémoire simple
  private rankingCache: Player[] = [];

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Initialise le cache au démarrage
   */
  async onModuleInit() {
    this.rankingCache = await this.playerRepository.find({
      order: { rank: 'DESC' },
    });
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.rankingCache;
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const existing = await this.playerRepository.findOneBy({ id: createPlayerDto.id });
    if (existing) {
      throw new ConflictException(`Le joueur ${createPlayerDto.id} existe déjà.`);
    }

    let initialRank = 1500;

    if (this.rankingCache.length > 0) {
      let totalScore = 0;
      for (const p of this.rankingCache) {
        totalScore += p.rank;
      }
      initialRank = Math.round(totalScore / this.rankingCache.length);
    }
    const player = this.playerRepository.create({
      id: createPlayerDto.id,
      rank: initialRank,
    });

    const savedPlayer = await this.playerRepository.save(player);

    this.rankingCache.push(savedPlayer);
    this.sortCache();
    this.eventEmitter.emit('ranking.update', savedPlayer);
    return savedPlayer;
  }

  async resolveMatch(matchDto: PostMatchDto): Promise<{ winner: Player; loser: Player }> {
    const { winner: winnerId, loser: loserId, draw } = matchDto;

    // 1. Récupération des joueurs
    const winnerPlayer = await this.playerRepository.findOneBy({ id: winnerId });
    const loserPlayer = await this.playerRepository.findOneBy({ id: loserId });

    if (!winnerPlayer || !loserPlayer) {
      throw new NotFoundException('Un des joueurs n\'existe pas.');
    }

    // 2. Calcul Elo (Logique provient du README)
    const K = 32;

    
    const probWinner = 1 / (1 + Math.pow(10, (loserPlayer.rank - winnerPlayer.rank) / 400));
    const probLoser = 1 / (1 + Math.pow(10, (winnerPlayer.rank - loserPlayer.rank) / 400));

    // Résultat réel
    // 1 pour victoire, 0.5 pour égalité, 0 pour défaite
    const actualScoreWinner = draw ? 0.5 : 1;
    const actualScoreLoser = draw ? 0.5 : 0;

    // Nouveau rang
    // Rn = Ro + K * (W - We)
    const newRankWinner = Math.round(winnerPlayer.rank + K * (actualScoreWinner - probWinner));
    const newRankLoser = Math.round(loserPlayer.rank + K * (actualScoreLoser - probLoser));

    // 3. Mise à jour des entités
    winnerPlayer.rank = newRankWinner;
    loserPlayer.rank = newRankLoser;

    await this.playerRepository.save([winnerPlayer, loserPlayer]);

    // 4. Mise à jour du cache local
    this.updateCache(winnerPlayer);
    this.updateCache(loserPlayer);

    // 5. Émission des événements pour le temps réel (SSE)
    this.eventEmitter.emit('ranking.update', winnerPlayer);
    this.eventEmitter.emit('ranking.update', loserPlayer);

    return { winner: winnerPlayer, loser: loserPlayer };
  }

  // Gestion du cache

  private updateCache(updatedPlayer: Player) {
    const index = this.rankingCache.findIndex(p => p.id === updatedPlayer.id);
    if (index !== -1) {
      this.rankingCache[index] = updatedPlayer;
    }
    this.sortCache();
  }

  private sortCache() {
    this.rankingCache.sort((a, b) => b.rank - a.rank);
  }
}
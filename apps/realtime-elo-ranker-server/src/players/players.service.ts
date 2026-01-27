import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
    private rankingService: RankingService, // Injection du cerveau
  ) {}

  // Plus besoin de getRanking ici, on utilise celui du RankingService via le Controller

  async createPlayer(dto: CreatePlayerDto): Promise<Player> {
    const existing = await this.playerRepository.findOneBy({ id: dto.id });
    if (existing) {
      throw new ConflictException(`Joueur ${dto.id} déjà existant.`);
    }

    // On demande au RankingService quel rang donner
    const initialRank = this.rankingService.calculateInitialRank();

    const player = this.playerRepository.create({
      id: dto.id,
      rank: initialRank,
    });

    const savedPlayer = await this.playerRepository.save(player);

    // On notifie le système (RankingService va écouter ça)
    this.eventEmitter.emit('player.updated', savedPlayer);
    
    // On notifie aussi le client via SSE (même évent)
    this.eventEmitter.emit('ranking.update', savedPlayer); 

    return savedPlayer;
  }

  async resolveMatch(dto: PostMatchDto): Promise<{ winner: Player; loser: Player }> {
    const winner = await this.playerRepository.findOneBy({ id: dto.winner });
    const loser = await this.playerRepository.findOneBy({ id: dto.loser });

    if (!winner || !loser) {
      throw new NotFoundException('Joueur introuvable');
    }

    // 1. On demande au RankingService de faire les maths
    const result = this.rankingService.calculateMatchResult(winner, loser, dto.draw);

    // 2. On applique les résultats
    winner.rank = result.newRankWinner;
    loser.rank = result.newRankLoser;

    // 3. On sauvegarde en BDD (Transaction implicite via save array)
    await this.playerRepository.save([winner, loser]);

    // 4. On émet les événements pour mettre à jour le cache ET le client
    this.eventEmitter.emit('player.updated', winner);
    this.eventEmitter.emit('player.updated', loser);
    
    // Pour le SSE du client
    this.eventEmitter.emit('ranking.update', winner);
    this.eventEmitter.emit('ranking.update', loser);

    return { winner, loser };
  }
}
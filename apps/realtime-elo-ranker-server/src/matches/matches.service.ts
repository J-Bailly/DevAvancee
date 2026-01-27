import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../players/player.entity'; // Import depuis le dossier parent
import { RankingService } from '../ranking/ranking.service';
import { PostMatchDto } from './dto/post-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private rankingService: RankingService,
    private eventEmitter: EventEmitter2,
  ) {}

  async resolveMatch(dto: PostMatchDto): Promise<{ winner: Player; loser: Player }> {
    // 1. VÉRIFICATION : Empêcher l'auto-match
    if (dto.winner === dto.loser) {
      throw new BadRequestException('Un joueur ne peut pas jouer contre lui-même.');
    }

    const winner = await this.playerRepository.findOneBy({ id: dto.winner });
    const loser = await this.playerRepository.findOneBy({ id: dto.loser });

    // 2. VÉRIFICATION : Existence des joueurs
    if (!winner) {
      throw new NotFoundException(`Le joueur gagnant '${dto.winner}' n'existe pas.`);
    }
    if (!loser) {
      throw new NotFoundException(`Le joueur perdant '${dto.loser}' n'existe pas.`);
    }

    // 3. Logique métier (Appel au RankingService)
    const result = this.rankingService.calculateMatchResult(winner, loser, dto.draw);

    // 4. Application des résultats
    winner.rank = result.newRankWinner;
    loser.rank = result.newRankLoser;

    // 5. Sauvegarde
    await this.playerRepository.save([winner, loser]);

    // 6. Notifications (Cache + SSE)
    this.eventEmitter.emit('player.updated', winner);
    this.eventEmitter.emit('player.updated', loser);
    
    this.eventEmitter.emit('ranking.update', winner);
    this.eventEmitter.emit('ranking.update', loser);

    return { winner, loser };
  }
}
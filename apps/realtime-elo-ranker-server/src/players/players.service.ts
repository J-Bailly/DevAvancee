import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
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
}
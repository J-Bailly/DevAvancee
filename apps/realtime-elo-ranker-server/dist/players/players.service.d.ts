import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { RankingService } from '../ranking/ranking.service';
export declare class PlayersService {
    private playerRepository;
    private eventEmitter;
    private rankingService;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2, rankingService: RankingService);
    createPlayer(dto: CreatePlayerDto): Promise<Player>;
    resolveMatch(dto: PostMatchDto): Promise<{
        winner: Player;
        loser: Player;
    }>;
}

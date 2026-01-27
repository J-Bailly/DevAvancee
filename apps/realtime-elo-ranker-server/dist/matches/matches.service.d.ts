import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../players/player.entity';
import { RankingService } from '../ranking/ranking.service';
import { PostMatchDto } from './dto/post-match.dto';
export declare class MatchesService {
    private playerRepository;
    private rankingService;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, rankingService: RankingService, eventEmitter: EventEmitter2);
    resolveMatch(dto: PostMatchDto): Promise<{
        winner: Player;
        loser: Player;
    }>;
}

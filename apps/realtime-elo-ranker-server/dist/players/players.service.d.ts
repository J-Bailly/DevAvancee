import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PlayersService {
    private playerRepository;
    private eventEmitter;
    private rankingCache;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    onModuleInit(): Promise<void>;
    getAllPlayers(): Promise<Player[]>;
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>;
    resolveMatch(matchDto: PostMatchDto): Promise<{
        winner: Player;
        loser: Player;
    }>;
    private updateCache;
    private sortCache;
}

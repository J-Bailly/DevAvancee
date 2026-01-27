import { MessageEvent } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
export declare class PlayersController {
    private readonly playersService;
    private readonly eventEmitter;
    constructor(playersService: PlayersService, eventEmitter: EventEmitter2);
    getRanking(): Promise<import("./player.entity").Player[]>;
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<import("./player.entity").Player>;
    resolveMatch(postMatchDto: PostMatchDto): Promise<{
        winner: import("./player.entity").Player;
        loser: import("./player.entity").Player;
    }>;
    sse(): Observable<MessageEvent>;
}

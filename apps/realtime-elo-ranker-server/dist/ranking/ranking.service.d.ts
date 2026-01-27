import { OnModuleInit } from '@nestjs/common';
import { Player } from '../players/player.entity';
import { Repository } from 'typeorm';
export declare class RankingService implements OnModuleInit {
    private playerRepository;
    private rankingCache;
    constructor(playerRepository: Repository<Player>);
    onModuleInit(): Promise<void>;
    getRanking(): Player[];
    handlePlayerUpdate(player: Player): void;
    calculateMatchResult(winner: Player, loser: Player, isDraw: boolean): {
        newRankWinner: number;
        newRankLoser: number;
    };
    calculateInitialRank(): number;
}

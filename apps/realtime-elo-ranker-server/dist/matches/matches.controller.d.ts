import { MatchesService } from './matches.service';
import { PostMatchDto } from './dto/post-match.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    resolveMatch(dto: PostMatchDto): Promise<{
        winner: import("../players/player.entity").Player;
        loser: import("../players/player.entity").Player;
    }>;
}

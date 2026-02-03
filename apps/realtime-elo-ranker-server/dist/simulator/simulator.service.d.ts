import { MatchesService } from '../matches/matches.service';
import { RankingService } from '../ranking/ranking.service';
export declare class SimulatorService {
    private readonly matchesService;
    private readonly rankingService;
    private readonly logger;
    constructor(matchesService: MatchesService, rankingService: RankingService);
    playAutomaticMatch(): Promise<void>;
}

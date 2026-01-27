"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const player_entity_1 = require("../players/player.entity");
const typeorm_2 = require("typeorm");
let RankingService = class RankingService {
    playerRepository;
    rankingCache = [];
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async onModuleInit() {
        this.rankingCache = await this.playerRepository.find({
            order: { rank: 'DESC' },
        });
        console.log(`Ranking initialized with ${this.rankingCache.length} players.`);
    }
    getRanking() {
        return this.rankingCache;
    }
    handlePlayerUpdate(player) {
        const index = this.rankingCache.findIndex((p) => p.id === player.id);
        if (index !== -1) {
            this.rankingCache[index] = player;
        }
        else {
            this.rankingCache.push(player);
        }
        this.rankingCache.sort((a, b) => b.rank - a.rank);
    }
    calculateMatchResult(winner, loser, isDraw) {
        const K = 32;
        const probWinner = 1 / (1 + Math.pow(10, (loser.rank - winner.rank) / 400));
        const probLoser = 1 / (1 + Math.pow(10, (winner.rank - loser.rank) / 400));
        const actualScoreWinner = isDraw ? 0.5 : 1;
        const actualScoreLoser = isDraw ? 0.5 : 0;
        const newRankWinner = Math.round(winner.rank + K * (actualScoreWinner - probWinner));
        const newRankLoser = Math.round(loser.rank + K * (actualScoreLoser - probLoser));
        return { newRankWinner, newRankLoser };
    }
    calculateInitialRank() {
        if (this.rankingCache.length === 0)
            return 1000;
        let total = 0;
        for (const p of this.rankingCache) {
            total += p.rank;
        }
        return Math.round(total / this.rankingCache.length);
    }
};
exports.RankingService = RankingService;
__decorate([
    (0, event_emitter_1.OnEvent)('player.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_entity_1.Player]),
    __metadata("design:returntype", void 0)
], RankingService.prototype, "handlePlayerUpdate", null);
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RankingService);
//# sourceMappingURL=ranking.service.js.map
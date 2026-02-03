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
var SimulatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const matches_service_1 = require("../matches/matches.service");
const ranking_service_1 = require("../ranking/ranking.service");
let SimulatorService = SimulatorService_1 = class SimulatorService {
    matchesService;
    rankingService;
    logger = new common_1.Logger(SimulatorService_1.name);
    constructor(matchesService, rankingService) {
        this.matchesService = matchesService;
        this.rankingService = rankingService;
    }
    async playAutomaticMatch() {
        const players = this.rankingService.getRanking();
        if (players.length < 2)
            return;
        const p1Index = Math.floor(Math.random() * players.length);
        let p2Index = Math.floor(Math.random() * players.length);
        while (p1Index === p2Index) {
            p2Index = Math.floor(Math.random() * players.length);
        }
        try {
            await this.matchesService.resolveMatch({
                winner: players[p1Index].id,
                loser: players[p2Index].id,
                draw: Math.random() < 0.1,
            });
        }
        catch (e) {
        }
    }
};
exports.SimulatorService = SimulatorService;
__decorate([
    (0, schedule_1.Interval)((2000)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimulatorService.prototype, "playAutomaticMatch", null);
exports.SimulatorService = SimulatorService = SimulatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [matches_service_1.MatchesService,
        ranking_service_1.RankingService])
], SimulatorService);
//# sourceMappingURL=simulator.service.js.map
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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const player_entity_1 = require("./player.entity");
const ranking_service_1 = require("../ranking/ranking.service");
let PlayersService = class PlayersService {
    playerRepository;
    eventEmitter;
    rankingService;
    constructor(playerRepository, eventEmitter, rankingService) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
        this.rankingService = rankingService;
    }
    async createPlayer(dto) {
        const existing = await this.playerRepository.findOneBy({ id: dto.id });
        if (existing) {
            throw new common_1.ConflictException(`Joueur ${dto.id} déjà existant.`);
        }
        const initialRank = this.rankingService.calculateInitialRank();
        const player = this.playerRepository.create({
            id: dto.id,
            rank: initialRank,
        });
        const savedPlayer = await this.playerRepository.save(player);
        this.eventEmitter.emit('player.updated', savedPlayer);
        this.eventEmitter.emit('ranking.update', savedPlayer);
        return savedPlayer;
    }
    async resolveMatch(dto) {
        const winner = await this.playerRepository.findOneBy({ id: dto.winner });
        const loser = await this.playerRepository.findOneBy({ id: dto.loser });
        if (!winner || !loser) {
            throw new common_1.NotFoundException('Joueur introuvable');
        }
        const result = this.rankingService.calculateMatchResult(winner, loser, dto.draw);
        winner.rank = result.newRankWinner;
        loser.rank = result.newRankLoser;
        await this.playerRepository.save([winner, loser]);
        this.eventEmitter.emit('player.updated', winner);
        this.eventEmitter.emit('player.updated', loser);
        this.eventEmitter.emit('ranking.update', winner);
        this.eventEmitter.emit('ranking.update', loser);
        return { winner, loser };
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2,
        ranking_service_1.RankingService])
], PlayersService);
//# sourceMappingURL=players.service.js.map
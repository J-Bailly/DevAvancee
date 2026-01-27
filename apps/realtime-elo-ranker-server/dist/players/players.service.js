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
const player_entity_1 = require("./player.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let PlayersService = class PlayersService {
    playerRepository;
    eventEmitter;
    rankingCache = [];
    constructor(playerRepository, eventEmitter) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
    }
    async onModuleInit() {
        this.rankingCache = await this.playerRepository.find({
            order: { rank: 'DESC' },
        });
    }
    async getAllPlayers() {
        return this.rankingCache;
    }
    async createPlayer(createPlayerDto) {
        const existing = await this.playerRepository.findOneBy({ id: createPlayerDto.id });
        if (existing) {
            throw new common_1.ConflictException(`Le joueur ${createPlayerDto.id} existe déjà.`);
        }
        let initialRank = 1500;
        if (this.rankingCache.length > 0) {
            let totalScore = 0;
            for (const p of this.rankingCache) {
                totalScore += p.rank;
            }
            initialRank = Math.round(totalScore / this.rankingCache.length);
        }
        const player = this.playerRepository.create({
            id: createPlayerDto.id,
            rank: initialRank,
        });
        const savedPlayer = await this.playerRepository.save(player);
        this.rankingCache.push(savedPlayer);
        this.sortCache();
        this.eventEmitter.emit('ranking.update', savedPlayer);
        return savedPlayer;
    }
    async resolveMatch(matchDto) {
        const { winner: winnerId, loser: loserId, draw } = matchDto;
        const winnerPlayer = await this.playerRepository.findOneBy({ id: winnerId });
        const loserPlayer = await this.playerRepository.findOneBy({ id: loserId });
        if (!winnerPlayer || !loserPlayer) {
            throw new common_1.NotFoundException('Un des joueurs n\'existe pas.');
        }
        const K = 32;
        const probWinner = 1 / (1 + Math.pow(10, (loserPlayer.rank - winnerPlayer.rank) / 400));
        const probLoser = 1 / (1 + Math.pow(10, (winnerPlayer.rank - loserPlayer.rank) / 400));
        const actualScoreWinner = draw ? 0.5 : 1;
        const actualScoreLoser = draw ? 0.5 : 0;
        const newRankWinner = Math.round(winnerPlayer.rank + K * (actualScoreWinner - probWinner));
        const newRankLoser = Math.round(loserPlayer.rank + K * (actualScoreLoser - probLoser));
        winnerPlayer.rank = newRankWinner;
        loserPlayer.rank = newRankLoser;
        await this.playerRepository.save([winnerPlayer, loserPlayer]);
        this.updateCache(winnerPlayer);
        this.updateCache(loserPlayer);
        this.eventEmitter.emit('ranking.update', winnerPlayer);
        this.eventEmitter.emit('ranking.update', loserPlayer);
        return { winner: winnerPlayer, loser: loserPlayer };
    }
    updateCache(updatedPlayer) {
        const index = this.rankingCache.findIndex(p => p.id === updatedPlayer.id);
        if (index !== -1) {
            this.rankingCache[index] = updatedPlayer;
        }
        this.sortCache();
    }
    sortCache() {
        this.rankingCache.sort((a, b) => b.rank - a.rank);
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], PlayersService);
//# sourceMappingURL=players.service.js.map
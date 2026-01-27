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
exports.PlayersController = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("./players.service");
const ranking_service_1 = require("../ranking/ranking.service");
const create_player_dto_1 = require("./dto/create-player.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const rxjs_1 = require("rxjs");
let PlayersController = class PlayersController {
    playersService;
    rankingService;
    eventEmitter;
    constructor(playersService, rankingService, eventEmitter) {
        this.playersService = playersService;
        this.rankingService = rankingService;
        this.eventEmitter = eventEmitter;
    }
    getRanking() {
        return this.rankingService.getRanking();
    }
    createPlayer(dto) {
        return this.playersService.createPlayer(dto);
    }
    sse() {
        return (0, rxjs_1.fromEvent)(this.eventEmitter, 'ranking.update').pipe((0, rxjs_1.map)((payload) => ({
            data: { type: 'RankingUpdate', player: payload },
        })));
    }
};
exports.PlayersController = PlayersController;
__decorate([
    (0, common_1.Get)('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Post)('player'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_player_dto_1.CreatePlayerDto]),
    __metadata("design:returntype", void 0)
], PlayersController.prototype, "createPlayer", null);
__decorate([
    (0, common_1.Sse)('ranking/events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], PlayersController.prototype, "sse", null);
exports.PlayersController = PlayersController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [players_service_1.PlayersService,
        ranking_service_1.RankingService,
        event_emitter_1.EventEmitter2])
], PlayersController);
//# sourceMappingURL=players.controller.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorModule = void 0;
const common_1 = require("@nestjs/common");
const simulator_service_1 = require("./simulator.service");
const matches_module_1 = require("../matches/matches.module");
const ranking_module_1 = require("../ranking/ranking.module");
let SimulatorModule = class SimulatorModule {
};
exports.SimulatorModule = SimulatorModule;
exports.SimulatorModule = SimulatorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            matches_module_1.MatchesModule,
            ranking_module_1.RankingModule,
        ],
        providers: [simulator_service_1.SimulatorService],
    })
], SimulatorModule);
//# sourceMappingURL=simulator.module.js.map
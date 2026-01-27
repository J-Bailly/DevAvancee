import { Body, Controller, Get, Post, Sse, MessageEvent } from '@nestjs/common';
import { PlayersService } from './players.service';
import { RankingService } from '../ranking/ranking.service'; 
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { map, Observable, fromEvent } from 'rxjs';

@Controller('api')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly rankingService: RankingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('ranking')
  getRanking() {
    return this.rankingService.getRanking();
  }

  @Post('player')
  createPlayer(@Body() dto: CreatePlayerDto) {
    return this.playersService.createPlayer(dto);
  }

  @Post('match')
  resolveMatch(@Body() dto: PostMatchDto) {
    return this.playersService.resolveMatch(dto);
  }

  @Sse('ranking/events')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ranking.update').pipe(
      map((payload) => ({
        data: { type: 'RankingUpdate', player: payload },
      } as MessageEvent)),
    );
  }
}
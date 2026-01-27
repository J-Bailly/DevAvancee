import { Controller, Get, Post, Body, Sse, MessageEvent } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PostMatchDto } from './dto/post-match.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('api')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('ranking')
  getRanking() {
    return this.playersService.getAllPlayers();
  }

  @Post('player')
  createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Post('match')
  resolveMatch(@Body() postMatchDto: PostMatchDto) {
    return this.playersService.resolveMatch(postMatchDto);
  }

  @Sse('ranking/events')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ranking.update').pipe(
      map((player) => {
        return {
          data: { 
            type: 'RankingUpdate', 
            player: player 
          },
        } as MessageEvent;
      }),
    );
  }
}
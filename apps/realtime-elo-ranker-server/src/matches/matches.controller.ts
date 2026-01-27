import { Body, Controller, Post } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { PostMatchDto } from './dto/post-match.dto';

@Controller('api/match')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  resolveMatch(@Body() dto: PostMatchDto) {
    return this.matchesService.resolveMatch(dto);
  }
}
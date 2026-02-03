import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../players/player.entity';

describe('RankingService', () => {
  let service: RankingService;

  const mockPlayerRepository = {
    find: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate Elo correctly for Winner (1200) vs Loser (800)', () => {
    const winner = { id: 'PlayerA', rank: 1200 } as Player;
    const loser = { id: 'PlayerB', rank: 800 } as Player;

    const result = service.calculateMatchResult(winner, loser, false);

    expect(result.newRankWinner).toBeCloseTo(1203, -1);
    
    expect(result.newRankLoser).toBeCloseTo(797, -1);
  });

  it('should calculate Elo correctly for a Draw', () => {
    const p1 = { id: 'A', rank: 1000 } as Player;
    const p2 = { id: 'B', rank: 1000 } as Player;

    const result = service.calculateMatchResult(p1, p2, true);

    expect(result.newRankWinner).toBe(1000);
    expect(result.newRankLoser).toBe(1000);
  });

  it('should calculate average rank correctly', () => {
    (service as any).rankingCache = [
      { id: '1', rank: 1000 } as Player,
      { id: '2', rank: 2000 } as Player
    ];

    const avg = service.calculateInitialRank();
    expect(avg).toBe(1500);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const timestamp = Date.now();
  const player1Id = `Winner_${timestamp}`;
  const player2Id = `Loser_${timestamp}`;

  it('/api/player (POST) - Create Player 1', () => {
    return request(app.getHttpServer())
      .post('/api/player')
      .send({ id: player1Id })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual(player1Id);
        expect(res.body.rank).toBeDefined();
      });
  });

  it('/api/player (POST) - Create Player 2', () => {
    return request(app.getHttpServer())
      .post('/api/player')
      .send({ id: player2Id })
      .expect(201);
  });

  it('/api/match (POST) - Resolve Match', () => {
    return request(app.getHttpServer())
      .post('/api/match')
      .send({
        winner: player1Id,
        loser: player2Id,
        draw: false,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.winner.id).toBe(player1Id);
        expect(res.body.loser.id).toBe(player2Id);

        expect(res.body.winner.rank).not.toBe(1000); 
      });
  });

  it('/api/ranking (GET) - Check Ladder', () => {
    return request(app.getHttpServer())
      .get('/api/ranking')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const p1 = res.body.find((p) => p.id === player1Id);
        expect(p1).toBeDefined();
      });
  });
});
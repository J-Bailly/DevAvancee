import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    
    EventEmitterModule.forRoot(),
    
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'elo-ranker.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


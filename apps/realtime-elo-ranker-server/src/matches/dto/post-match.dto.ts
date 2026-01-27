import { IsBoolean, IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class PostMatchDto {
  @IsString()
  @IsNotEmpty()
  winner: string;

  @IsString()
  @IsNotEmpty()
  loser: string;

  @IsBoolean()
  @IsDefined()
  draw: boolean;
}
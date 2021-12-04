import { IsNumberString } from 'class-validator';

export class StorageReqQueryDto {
  @IsNumberString()
  last: string;

  @IsNumberString()
  limit: string;

  @IsNumberString()
  variant?: string;
}

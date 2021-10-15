import { IsString } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  name: string;
}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsString, ValidateIf } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @IsString()
  @ValidateIf((object, value) => value == null)
  modifiedBy: string;
}

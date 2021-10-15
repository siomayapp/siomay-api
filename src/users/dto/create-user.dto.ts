import { IsEmpty, IsMobilePhone, IsString, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsMobilePhone('id-ID')
  @IsEmpty()
  @ValidateIf((object, value) => value == null)
  phone: string | null;

  @IsString()
  @ValidateIf((object, value) => value == null)
  address: string | null;

  @IsString()
  @ValidateIf((object, value) => value == null)
  avatar: string | null;

  salt: string;
}

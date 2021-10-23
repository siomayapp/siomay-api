import { IsEmpty, IsMobilePhone, IsString, ValidateIf } from 'class-validator';
import { UserRole } from '../entities/users.role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  role: UserRole;

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

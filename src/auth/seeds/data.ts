import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserRole } from '../../users/entities/users.role.enum';

export const ownerSeedData: CreateUserDto = {
  name: process.env.SEED_OWNER_NAME,
  role: UserRole.OWNER,
  username: process.env.SEED_OWNER_USERNAME,
  password: process.env.SEED_OWNER_PASSWORD,
  phone: process.env.SEED_OWNER_PHONE,
  address: null,
  avatar: null,
  createdBy: 'system',
  salt: null,
};

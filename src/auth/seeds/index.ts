import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/entities/users.role.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthSeederService {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  async createOwner(): Promise<void> {
    await this.authService.register({
      name: this.configService.get('SEED_OWNER_NAME'),
      role: UserRole.OWNER,
      username: this.configService.get('SEED_OWNER_USERNAME'),
      password: this.configService.get('SEED_OWNER_PASSWORD'),
      phone: this.configService.get('SEED_OWNER_PHONE'),
      address: null,
      avatar: null,
      createdBy: 'system',
      salt: null,
    });
  }
}

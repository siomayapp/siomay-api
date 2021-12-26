import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { IPagination } from '../shared/types';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/users.entity';
import { UserRole } from './entities/users.role.enum';
import { IFilterUser } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async findAll(
    pagination: IPagination,
    filter: IFilterUser,
  ): Promise<[Users[], number]> {
    const result = await this.usersRepository.findAndCount({
      where: { role: Not(UserRole.OWNER), ...filter },
      skip: (pagination.page - 1) * pagination.per_page,
      take: pagination.per_page,
      order: { id: 'ASC' },
    });
    return result;
  }

  async findOne(id: number): Promise<Users> {
    return await this.usersRepository.findOneOrFail(id);
  }

  async findByUsername(username: string, withPassword = false): Promise<Users> {
    let userRecord: Users;
    if (!withPassword) {
      userRecord = await this.usersRepository.findOneOrFail({ username });
    } else {
      userRecord = await this.usersRepository
        .createQueryBuilder('users')
        .addSelect('users.password')
        .where('users.username = :username', { username })
        .getOne();
    }

    return userRecord;
  }

  async createOne(inputUser: CreateUserDto): Promise<Users> {
    return await this.usersRepository.save(inputUser);
  }

  async updateOne(id: number, inputUser: Users): Promise<Users> {
    // const result = await this.usersRepository.update(id, { ...inputUser });
    // return result.raw[0];
    return await this.usersRepository.save({ id: id, ...inputUser });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

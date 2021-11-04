import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/users.entity';
import { UserRole } from './entities/users.role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async findAll(
    lastId: number,
    limit: number,
  ): Promise<[Users[], number | null]> {
    const users = await this.usersRepository.find({
      where: { id: MoreThan(lastId), role: Not(UserRole.OWNER) },
      take: limit,
      order: { id: 'ASC' },
    });
    const lastRowId = users.length > 0 ? users[users.length - 1].id : null;
    return [users, lastRowId];
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

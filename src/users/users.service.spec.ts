import { Test } from '@nestjs/testing';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    // it('should return Users data', async () => {
    //   let result: Promise<[Users[], number]>;
    //   jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

    //   expect(
    //     await usersService.findAll(
    //       { page: 1, per_page: 10 },
    //       { role: undefined },
    //     ),
    //   ).toBe(result);
    // });
  });
});

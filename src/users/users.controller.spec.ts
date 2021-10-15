import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  //   let userRepositoryMock: MockType

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('root', () => {
    it('should return "Get All Users"', async () => {
      let result: Promise<Users[]>;
      jest.spyOn(usersService, 'findAll').mockImplementation(() => result);

      expect(await usersController.getAllUsers()).toBe(result);
    });
  });
});

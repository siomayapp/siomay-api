import { Users } from '../../users/entities/users.entity';

export interface IRequestWithUser extends Request {
  user: Users;
}

export interface IRequestHeader extends Headers {
  authorization: string;
}

export interface IAuthResponseData {
  user: Users;
  token: string;
}

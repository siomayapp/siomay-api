import { Session } from 'express-session';
import { Users } from '../../users/users.entity';

export interface IRequestWithUser extends Request {
  user: Users;
  session: Session;

  logOut();
}

export interface IAuthResponseData {
  user: Users;
  token: string;
}

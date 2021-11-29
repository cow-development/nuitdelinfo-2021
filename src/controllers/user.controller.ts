import {
  NextFunction,
  Request,
  Response
} from 'express';
import { UserRepository } from '../repos/user.repository';

export class UserController {
  constructor(private _repo: UserRepository) {}

  async any(req: Request, res: Response, next: NextFunction) {
    return 'hello user';
  }
}
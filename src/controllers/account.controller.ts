import { AppError } from '../model/error.model';
import { Helper } from '../helper.utils';
import {
  NextFunction,
  Request,
  Response
} from 'express';
import { UserRepository } from '../repos/user.repository';
import { CreateUserPayload } from '../model/DTO/create-user.payload';

export class AccountController {
  constructor(private _repo: UserRepository) {}

  async create(req: Request, res: Response, next: NextFunction) {
    if (!req.body
      || Helper.isObjectEmpty(req.body)
      || !req.body.username
      || !req.body.password) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
      }

      return await this._repo.create(
        <CreateUserPayload>req.body
      );
  }
}
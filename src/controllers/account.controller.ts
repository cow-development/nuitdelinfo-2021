import { AccountRepository } from '../repos/account.repository';
import { AuthenticatePayload } from '../model/DTO/account/authenticate.payload';
import { AppError } from '../model/error.model';
import { Helper } from '../helper.utils';
import {
  NextFunction,
  Request,
  Response
} from 'express';
import { CreateUserPayload } from '../model/DTO/account/create-user.payload';
import { SignedRequest } from '../model/signed-request.model';
import { UpdateUserPayload } from '../model/DTO/account/update-user.payload';
import { isValidObjectId } from 'mongoose';

export class AccountController {
  constructor(private _repo: AccountRepository) {}
  
  async authenticate(req: Request, res: Response, next: NextFunction) {
    if (!req.body
      || Helper.isObjectEmpty(req.body)
      || !req.body.username
      || !req.body.password) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
    }

      return await this._repo.authenticate(
        <AuthenticatePayload>req.body
      );
  }
  
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
  
  async update(req: Request, res: Response, next: NextFunction) {
    if (!req.body
      || Helper.isObjectEmpty(req.body)
      || !req.params.userId) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
    }

    if (!isValidObjectId(req.params.userId)) {
      throw new AppError(400, 'Invalid object id.');
    }

    return await this._repo.update(
      req.params.userId as string,
      <UpdateUserPayload>req.body
    );
  }

  async verify(req: SignedRequest, res: Response, next: NextFunction) {
    const verifiedUser = await this._repo.verify(req.author._id);
    return { ...verifiedUser, token: req.token };
  }
}
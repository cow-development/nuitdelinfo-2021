import { AppError } from '../model/error.model';
import { CreateRescuePayload } from '../model/DTO/rescue/create-rescue.payload';
import { Helper } from '../helper.utils';
import {
  NextFunction,
  Response
} from 'express';
import { RescueRepository } from '../repos/rescue.repository';
import { SignedRequest } from '../model/signed-request.model';

export class RescueController {
  constructor(private _repo: RescueRepository) {}
  
  async create(req: SignedRequest, res: Response, next: NextFunction) {
    if (!req.body
      || Helper.isObjectEmpty(req.body)
      || !req.body.author
      || !req.body.rescueDate
      || Helper.isObjectEmpty(req.body.author)
      || !req.body.rescuers
      || req.body.rescuers.length === 0) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
      }

      return await this._repo.create(
        <CreateRescuePayload>req.body
      );
  }

  async findAll(req: SignedRequest, res: Response, next: NextFunction) {
    return await this._repo.findAll();
  }
}
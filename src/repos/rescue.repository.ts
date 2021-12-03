import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from '../services/monitoring.service';
import {
  Rescue,
  RescueModel
} from '../model/mongoose/rescue/rescue.types';
import { CreateRescuePayload, UpdateRescuePayload } from '../model/DTO/rescue/create-rescue.payload';

// @ts-ignore
import { ObjectId } from 'mongodb';
import { AppError } from '../model/error.model';
import { AccountRepository } from './account.repository';

export class RescueRepository implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(
    private _model: RescueModel,
    private _userRepo: AccountRepository
  ) {
    this._monitor.log(LogType.passed, 'Initialized rescue repository');
  }

  async confirm(rescueId: string, authorId: string) {
    const user = await this._userRepo.findById(authorId);
    if (!user.isAdmin) {
      throw new AppError(403, 'Current user is not an admin and therefor cannot confirm a standing-by rescue.');
    }

    const rescue = await this.findById(rescueId);
    rescue.isConfirmed = true;
    await rescue.save();

    return await this.findById(rescue.id);
  }

  async create(payload: CreateRescuePayload, authorId: string) {
    const rescue: Omit<Rescue, 'author'> = {
      location: payload.location,
      rescueDate: payload.rescueDate,
      rescued: payload.rescued || [],
      rescuers: payload.rescuers,
      unrescued: payload.unrescued || []
    };

    return await this._model.create({
      ...rescue,
      author: {
        _id: new ObjectId(authorId),
        firstname: payload.author?.firstname,
        lastname: payload.author?.lastname
      }
    });
  }

  async delete(rescueId: string) {
    const rescue = await this.findById(rescueId);
    return await this._model.findByIdAndDelete(rescue.id);
  }

  async findAll() {
    return await this._model.find({});
  }

  async findById(rescueId: string) {
    const rescue = await this._model.findById(rescueId);
    if (!rescue) {
      throw new AppError(404, `Couldn't find any rescue with id '${rescueId}'.`);
    }
    return rescue;
  }

  async update(rescueId: string, payload: UpdateRescuePayload, authorId: string) {
    const rescue = await this.findById(rescueId);

    const castedId = new ObjectId(rescue.author._id);
    if (!castedId.equals(authorId)) {
      throw new AppError(403, 'User must have authored the rescue to update it.');
    }

    const user = await this._userRepo.findById(authorId);
    if (rescue.isConfirmed && !user.isAdmin) {
      throw new AppError(403, 'Rescue record is already confirmed and therefore cannot be updated anymore.');
    }

    const newRescue: Rescue = {
      author: rescue.author,
      location: payload.location || rescue.location,
      rescueDate: payload.rescueDate || rescue.rescueDate,
      rescued: payload.rescued || rescue.rescued,
      rescuers: payload.rescuers || rescue.rescuers,
      unrescued: payload.unrescued || rescue.unrescued
    };

    await this._model.findByIdAndUpdate(rescue.id, newRescue);
    return await this.findById(rescue.id);
  }
}
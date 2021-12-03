import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from '../services/monitoring.service';
import {
  Rescue,
  RescueModel
} from '../model/mongoose/rescue/rescue.types';
import { CreateRescuePayload } from '../model/DTO/rescue/create-rescue.payload';

// @ts-ignore
import { ObjectId } from 'mongodb';
import { AppError } from '../model/error.model';

export class RescueRepository implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(private _model: RescueModel) {
    this._monitor.log(LogType.passed, 'Initialized rescue repository');
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
    const rescue = await this._model.findById(rescueId);
    if (!rescue) {
      throw new AppError(404, `Couldn't find any rescue with id '${rescueId}'.`);
    }
    return await this._model.findByIdAndDelete(rescueId);
  }

  async findAll() {
    return await this._model.find({});
  }
}
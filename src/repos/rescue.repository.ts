import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from '../services/monitoring.service';
import {
  Rescue,
  RescueModel
} from '../model/mongoose/rescue/rescue.types';
import { CreateRescuePayload } from '../model/DTO/rescue/create-rescue.payload';

export class RescueRepository implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(private _model: RescueModel) {
    this._monitor.log(LogType.passed, 'Initialized rescue repository');
  }

  async create(payload: CreateRescuePayload) {
    const rescue: Omit<Rescue, 'author'> = {
      rescueDate: payload.rescueDate,
      rescued: payload.rescued || [],
      rescuers: payload.rescuers,
      unrescued: payload.unrescued || []
    };

    return await this._model.create({
      ...rescue,
      author: {
        firstname: payload.author?.firstname,
        lastname: payload.author?.lastname
      }
    });
  }

  async findAll() {
    return await this._model.find({});
  }
}
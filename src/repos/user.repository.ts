import { CreateUserPayload } from '../model/DTO/create-user.payload';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { IUserModel } from '../model/mongoose/user/user.types';
import { MonitoringService } from '../services/monitoring.service';

export class UserRepository implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(private _model: IUserModel) {
    this._monitor.log(LogType.passed, 'Initialized user repository');
  }

  async create(payload: CreateUserPayload) {
    console.log(payload);
  }
}
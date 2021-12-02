import { Connection } from 'mongoose';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import {
  Userdocument,
  UserModel
} from '../model/mongoose/user/user.types';
import { MonitoringService } from './monitoring.service';
import userSchema from '../model/mongoose/user/user.schema';

export class ModelService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  get models() {
    return [
      this._connection.model('user')
    ];
  }

  constructor(private _connection: Connection) {}

  async setupModels() {
    this._monitor.log(LogType.pending, 'Initializing mongoose models...');

    this._connection?.model<Userdocument>('user', userSchema) as UserModel;

    this._connection
      .modelNames()
      .forEach(name => {
        this.monitor.log(LogType.passed, `Initialized mongoose model '${name}'`);
      });
  }
}
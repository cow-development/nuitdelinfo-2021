import { AccountRepository } from '../repos/account.repository';
import {
  Document,
  Model
} from 'mongoose';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { UserModel } from '../model/mongoose/user/user.types';
import { MonitoringService } from './monitoring.service';

export class RepositoryService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _userRepository = <AccountRepository>{};
  
  get monitor() {
    return this._monitor;
  }

  get userRepository() {
    return this._userRepository;
  }

  constructor(private _models: Model<Document, {}>[]) {
    this._setupRepositories();
  }

  private _setupRepositories() {
    this._monitor.log(LogType.pending, 'Setting up repositories...');

    const model = this._models.find(model => model.modelName === 'user');
    this._userRepository = new AccountRepository(<UserModel>model);

    this._monitor.log(LogType.passed, 'Set up repositories');
  }
}
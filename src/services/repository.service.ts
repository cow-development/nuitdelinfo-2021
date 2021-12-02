import { AccountRepository } from '../repos/account.repository';
import {
  Document,
  Model
} from 'mongoose';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from './monitoring.service';
import { RescueModel } from '../model/mongoose/rescue/rescue.types';
import { RescueRepository } from '../repos/rescue.repository';
import { UserModel } from '../model/mongoose/user/user.types';

export class RepositoryService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _accountRepository = <AccountRepository>{};
  private _rescueRepository = <RescueRepository>{};
  
  get monitor() {
    return this._monitor;
  }

  get rescueRepository() {
    return this._rescueRepository;
  }

  get userRepository() {
    return this._accountRepository;
  }

  constructor(private _models: Model<Document, {}>[]) {
    this._setupRepositories();
  }

  private _setupRepositories() {
    this._monitor.log(LogType.pending, 'Setting up repositories...');

    let model = this._models.find(model => model.modelName === 'user');
    this._accountRepository = new AccountRepository(<UserModel>model);

    model = this._models.find(model => model.modelName === 'rescue');
    this._rescueRepository = new RescueRepository(<RescueModel>model);

    this._monitor.log(LogType.passed, 'Set up repositories');
  }
}
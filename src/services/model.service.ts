import {
  Connection,
  Document,
  Schema
} from 'mongoose';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from './monitoring.service';

export class ModelService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  constructor(private _connection: Connection) {}

  async setupModels() {
    this._monitor.log(LogType.pending, 'Initializing mongoose models...');

    // this._connection?.model<Document>('', {} as Schema) as any;
    
    this._connection
      .modelNames()
      .forEach(name => {
        this.monitor.log(LogType.passed, `Initialized mongoose model '${name}'`);
      });
  }
}
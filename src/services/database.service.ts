import { createConnection } from 'mongoose';
import { ErrorHandler } from '../model/error.model';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from './monitoring.service';

export class DatabaseService implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  get monitor() {
    return this._monitor;
  }

  setupDatabase() {
    try {
      this.monitor.log(LogType.pending, `Establishing connection with database...`);

      const assembledURI = this._assembleURI();
      return createConnection(assembledURI);
      
    } catch (e: any) {
      this._monitor.log(LogType.failed, `Failed to create connection with database`);
      this._monitor.log(LogType.failed, '  Aborted process');
      throw e;
    }
  }

  private _assembleURI() {
    if (
      !process.env.DB_URI ||
      !process.env.DB_USER_NAME ||
      !process.env.DB_USER_PASSWORD
    ) throw new ErrorHandler(500, 'Couldn\'t retrieve either cloud database URI or name, user or password from .env file.');

    return process.env.DB_URI
      .replace('<username>', process.env.DB_USER_NAME)
      .replace('<password>', process.env.DB_USER_PASSWORD);
  }
}
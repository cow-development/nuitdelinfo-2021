import { createConnection } from 'mongoose';
import { AppError } from '../model/error.model';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { ModelService } from './model.service';
import { MonitoringService } from './monitoring.service';

export class DatabaseService implements IMonitored {
  private _modelService = <ModelService>{};

  private _monitor = new MonitoringService(this.constructor.name);
  
  get modelService() {
    return this._modelService;
  }

  get monitor() {
    return this._monitor;
  }

  async setupDatabase() {
    try {
      this.monitor.log(LogType.pending, `Establishing connection with database...`);

      const assembledURI = this._assembleURI();
      const defaultOptions = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      };
      const connection = await createConnection(assembledURI, defaultOptions);

      this._modelService = new ModelService(connection);
      await this._modelService.setupModels();

      this.monitor.log(LogType.pending, `Established connection with database`);

      return connection;
      
    } catch (e) {
      this._monitor.log(LogType.failed, `Failed to create connection with database`);
      this._monitor.log(LogType.failed, '  Aborted process');
      throw e;
    }
  }

  private _assembleURI() {
    if (
      !process.env.DB_URI ||
      !process.env.DB_NAME ||
      !process.env.DB_USER_NAME ||
      !process.env.DB_USER_PASSWORD
    ) throw new AppError(500, 'Couldn\'t retrieve either cloud database URI or name, user or password from .env file.');

    return process.env.DB_URI
      .replace('<dbname>', process.env.DB_NAME)
      .replace('<username>', process.env.DB_USER_NAME)
      .replace('<password>', process.env.DB_USER_PASSWORD);
  }
}
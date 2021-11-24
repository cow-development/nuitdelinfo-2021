import { DatabaseService } from './database.service';

/**
 * Application global initialization service.
 */
class InitService {
  private _dbService = <DatabaseService>{};

  get databaseService() {
    return this._dbService;
  }

  async start() {
    this._dbService = new DatabaseService();
    this._dbService.setupDatabase();
  }
}

export const initService = new InitService();
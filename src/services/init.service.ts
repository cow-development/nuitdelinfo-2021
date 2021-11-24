import { DatabaseService } from './database.service';
import { RepositoryService } from './repository.service';

/**
 * Application global initialization service.
 */
class InitService {
  private _dbService = <DatabaseService>{};
  private _rpService = <RepositoryService>{};

  get databaseService() {
    return this._dbService;
  }

  async start() {
    this._dbService = new DatabaseService();
    await this._dbService.setupDatabase();
    
    this._rpService = new RepositoryService(
      this._dbService
        .modelService
        .models
    );
  }
}

export const initService = new InitService();
import { AccountController } from '../../controllers/account.controller';
import { IMonitored } from '../../model/IMonitored';
import { LogType } from '../../model/log.model';
import { MonitoringService } from '../../services/monitoring.service';
import {
  NextFunction,
  Request,
  Response
} from 'express';
import { Router } from 'express';

export class AccountRouter implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _router = Router();

  get monitor() {
    return this._monitor;
  }

  get router() {
    return this._router;
  }

  constructor(
    private _accountController: AccountController
  ) {
    this._setupRoutes();
  }

  private _setupRoutes() {
    this._monitor.log(LogType.pending, 'Setting up account routes...');

    this._router.post('/', (req: Request, res: Response, next: NextFunction) => {
      this._accountController.create(req, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router
      .stack
      .forEach(route => {
        this.monitor.log(LogType.passed, `Set up account route ${route.regexp}`);
      });

    this._monitor.log(LogType.passed, 'Set up account routes');
  }
}
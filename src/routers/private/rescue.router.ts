import { IMonitored } from '../../model/IMonitored';
import { LogType } from '../../model/log.model';
import { MonitoringService } from '../../services/monitoring.service';
import {
  NextFunction,
  Request,
  Response
} from 'express';
import { RescueController } from '../../controllers/rescue.controller';
import { Router } from 'express';
import { SignedRequest } from '../../model/signed-request.model';

export class RescueRouter implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _router = Router();

  get monitor() {
    return this._monitor;
  }

  get router() {
    return this._router;
  }

  constructor(
    private _rescueController: RescueController
  ) {
    this._setupRoutes();
  }

  private _setupRoutes() {
    this._monitor.log(LogType.pending, 'Setting up rescue routes...');

    this._router.post('/', (req: Request, res: Response, next: NextFunction) => {
      this._rescueController.create(req as SignedRequest, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
      this._rescueController.findAll(req as SignedRequest, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router.delete('/:rescueId', (req: Request, res: Response, next: NextFunction) => {
      this._rescueController.delete(req as SignedRequest, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router
      .stack
      .forEach(route => {
        this.monitor.log(LogType.passed, `Set up rescue route ${route.regexp}`);
      });

    this._monitor.log(LogType.passed, 'Set up rescue routes');
  }
}
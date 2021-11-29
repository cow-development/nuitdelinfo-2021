import { IMonitored } from './model/IMonitored';
import { MonitoringService } from './services/monitoring.service';
import { Router } from 'express';
import { LogType } from './model/log.model';
import { ControllerService } from './services/controller.service';

/**
 * Application main (and unique) router.
 */
export class AppRouter implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _router = Router();

  get monitor() {
    return this._monitor;
  }

  get router() {
    return this._router;
  }

  constructor(private _controllerService: ControllerService) {
    this._setupRoutes();
  }

  private _setupRoutes() {
    this._monitor.log(LogType.pending, 'Setting up application routes...');

    this._router.get('/user', (req, res, next) => {
      this._controllerService.userController.any(req, res, next)
        .then(result =>
          res.status(200).json(result)
        );
    });

    this._router
      .stack
      .forEach(route => {
        this.monitor.log(LogType.passed, `Set up application route ${route.regexp}`);
      });

    this._monitor.log(LogType.passed, 'Set up application routes');
  }
}
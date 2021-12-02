import { ControllerService } from '../services/controller.service';
import { IMonitored } from '../model/IMonitored';
import { LogType } from '../model/log.model';
import { MonitoringService } from '../services/monitoring.service';
import { PublicRouter } from './public/public.router';
import { Router } from 'express';

/**
 * Application main (and unique) router.
 */
export class AppRouter implements IMonitored {
  private _monitor = new MonitoringService(this.constructor.name);

  private _publicRouter = <PublicRouter>{};
  // private _privateRouter = <PrivateRouter>{};

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

    this._publicRouter = new PublicRouter(this._controllerService.accountController);
    this._router.use('/public', this._publicRouter.router);

    this._router
      .stack
      .forEach(route => {
        this.monitor.log(LogType.passed, `Set up application route ${route.regexp}`);
      });

    this._monitor.log(LogType.passed, 'Set up application routes');
  }
}
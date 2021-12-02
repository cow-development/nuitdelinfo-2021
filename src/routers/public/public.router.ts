import { Router } from "express";
import { AccountController } from "../../controllers/account.controller";
import { IMonitored } from "../../model/IMonitored";
import { LogType } from "../../model/log.model";
import { MonitoringService } from "../../services/monitoring.service";
import { AccountRouter } from "./account.router";

export class PublicRouter implements IMonitored {
  private _accountRouter = <AccountRouter>{};

  private _monitor = new MonitoringService(this.constructor.name);
  
  private _router = Router();
  
  /** Retrieve class monitoring service. */
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
    this._monitor.log(LogType.pending, 'Setting up public routes...');

    this._accountRouter = new AccountRouter(this._accountController);
    this._router.use('/account', this._accountRouter.router);

    this._router
      .stack
      .forEach(route => {
        this.monitor.log(LogType.passed, `Set up public route ${route.regexp}`);
      });

    this._monitor.log(LogType.passed, 'Set up public routes');
  }
}
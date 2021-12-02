import { AccountController } from '../../controllers/account.controller';
import { AppError } from '../../model/error.model';
import { IMonitored } from '../../model/IMonitored';
import jwt from 'jsonwebtoken';
import { LogType } from '../../model/log.model';
import { MonitoringService } from '../../services/monitoring.service';
import {
  NextFunction,
  Request,
  Response
} from 'express';
import { Router } from 'express';
import { SignedRequest } from '../../model/signed-request.model';
import { User } from '../../model/mongoose/user/user.types';
import { RescueRouter } from './rescue.router';
import { RescueController } from '../../controllers/rescue.controller';

export class PrivateRouter implements IMonitored {
  private _rescueRouter = <RescueRouter>{};

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
    private _rescueController: RescueController,
  ) {
    this._setupRoutes();
  }

  private _setupRoutes() {
    this._monitor.log(LogType.pending, 'Setting up private routes...');

    this._router.use((req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization)
        throw new AppError(401, 'Missing authorization headers.');
      
      // we split it because it looks like 'Bearer tkEOa3941ks...'
      // and we don't want the word 'Bearer' in final token value
      const [
        type,
        token
      ] = req.headers.authorization.split(' ');
      
      let user;
      try { user = jwt.verify(token, process.env.JWT as string); }
      catch (e) { throw new AppError(401, 'Invalid token.'); }

      (req as SignedRequest).author =  {
        _id: (user as any)._id,
        ...user as Partial<User>
      };
      
      next();
    });

    this._rescueRouter = new RescueRouter(this._rescueController);
    this._router.use('/rescue', this._rescueRouter.router);

    this._router
      .stack
      .forEach(route => {
        this.monitor.log(LogType.passed, `Set up private route ${route.regexp}`);
      });

    this._monitor.log(LogType.passed, 'Set up private routes');
  }
}
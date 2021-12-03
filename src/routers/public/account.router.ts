import { AppError } from '../../model/error.model';
import { AccountController } from '../../controllers/account.controller';
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

    this._router.use((req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization) {
        next();
        return;
      }

      if (
        (req.path.includes('/update')
        || req.path.includes('/delete'))
        && !req.headers.authorization) {
        throw new AppError(401, 'Missing authorization headers.');
      }
      
      const [
        type,
        token
      ] = req.headers.authorization.split(' ');
      
      let user;
      try { user = jwt.verify(token, process.env.JWT as string); }
      catch (e) { throw new AppError(401, 'Invalid token.'); }

      (req as SignedRequest).author = {
        _id: (user as any)._id,
        ...user as Partial<User>
      };
      (req as SignedRequest).token = token;
      
      next();
    });

    this._router.post('/', (req: Request, res: Response, next: NextFunction) => {
      this._accountController.create(req, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router.post('/auth', (req: Request, res: Response, next: NextFunction) => {
      this._accountController.authenticate(req, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router.get('/verify', (req: Request, res: Response, next: NextFunction) => {
      this._accountController.verify(req as SignedRequest, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router.put('/update/:userId', (req: Request, res: Response, next: NextFunction) => {
      this._accountController.update(req as SignedRequest, res, next)
        .then(result => {
          res.status(200).json(result)
        })
        .catch(error => next(error));
    });

    this._router.delete('/delete/:userId', (req: Request, res: Response, next: NextFunction) => {
      this._accountController.delete(req as SignedRequest, res, next)
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
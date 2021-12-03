import { AppRouter } from './routers/app.router';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppError } from './model/error.model';
import express from 'express';
import { initService } from './services/init.service';
import { MonitoringService } from './services/monitoring.service';
import morgan from 'morgan';
import {
  NextFunction,
  Request,
  Response
} from 'express';
import { LogType } from './model/log.model';

(async () => {
  // load the environment variables from the .env file
  dotenv.config({
    path: '.env'
  });

  /**
   * Express server application class.
   * @description Will later contain the routing system.
   */
  class Server {
    public app = express();
    public appRouter = <AppRouter>{};

    private _monitor = new MonitoringService(this.constructor.name);

    get monitor() {
      return this._monitor;
    }

    constructor() {}

    async configureRouter() {
      await initService.start();
      this.appRouter = new AppRouter(initService.controllerService);
    }
  }

  // initialize server app
  const server = new Server();

  if (process.env.NODE_ENV === 'production') {
    // make server use static front-end files
    server.app.use(express.static('public'));
  }
  
  // configurate server app body parser
  server.app.use(express.json());
  server.app.use(express.urlencoded({
    extended: true
  }));

  // make server app use cors
  server.app.use(cors());
  
  // make server app use morgan logging system with custom tokens
  morgan.token('angle-bracket', () => '>');
  morgan.token('timestamp', () => new Date().toISOString());
  server.app.use(
    morgan(':angle-bracket :timestamp :method :url :status :res[content-length] - :response-time ms')
  );
  
  // make server app handle any route starting with '/api'
  await server.configureRouter();
  server.app.use('/api', server.appRouter.router);

  // make server app handle any error
  server.app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    if (statusCode === 500) {
      server.monitor.log(LogType.failed, `↱ [NOT HANDLED] : ${err.stack as string}`);
    }
    else server.monitor.log(LogType.failed, `↱ ${err.message}`);

    res.status(statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  });

  // make server listen on some port
  ((port = process.env.APP_PORT || 5000) => {
    server.app.listen(
      port,
      () => {
        console.log('             _ _      _      _ _        __            ____   ___ ____  _ ');
        console.log(' _ __  _   _(_) |_ __| | ___| (_)_ __  / _| ___      |___ \\ / _ |\___ \\/ |');
        console.log('| \'_ \\| | | | | __/ _` |/ _ \\ | | \'_ \\| |_ / _ \\ _____ __) | | | |__) | |');
        console.log('| | | | |_| | | || (_| |  __/ | | | | |  _| (_) |_____/ __/| |_| / __/| |');
        console.log('|_| |_|\\__,_|_|\\__\\__,_|\\___|_|_|_| |_|_|  \\___/     |_____|\\___/_____|_|');
        console.log('');
        console.log(`> Version: v${require('../package')?.version}`);
        console.log(`> Port: ${port}`);
        console.log('> Ready to handle requests!');
      });
  })();
})();
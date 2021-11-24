import dotenv from 'dotenv';
import express from 'express';
import { initService } from './services/init.service';

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

    constructor() {}

    async configureRouter() {
      // TODO 🛠 start init service
      await initService.start();
      // TODO 🛠 this.appRouter = new AppRouter(initService.controllerService);
    }
  }

  // initialize server app
  const server = new Server();
  await server.configureRouter();

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
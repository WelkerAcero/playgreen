import { IRouter } from "express";
import MiddlewareConfig from "../app/Http/Middleware/MiddlewareConfig"
import ConfigRouteList from "../routes/ConfigRouteList";
import dotenv from "dotenv";
dotenv.config();

export default class MyServer extends MiddlewareConfig {
  private _port: number | string = process.env.PORT || 8000;

  constructor() {
    super();
  }

  routes() {
    const ROUTES: IRouter[] = ConfigRouteList.getRoutes();
    ROUTES.forEach((element: IRouter) => {
      this._app.use('/api/v1/playgreen', element);
    });
  }

  async start() {
    this.routes();
    this._app.listen(this._port, () => {
      console.log("localhost:" + this._port);
    });
  }

}

const server = new MyServer();
server.start();



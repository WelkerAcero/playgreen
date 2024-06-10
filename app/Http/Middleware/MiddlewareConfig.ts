import express, { Express, Response, Request, NextFunction } from "express";
import response_time from "response-time";
import cors from "cors";
import cookieParser from 'cookie-parser';
import BodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

export default class MiddlewareConfig {
  private frontUrl?: string = process.env.MAIN_FRONT_END_URL;
  private _corsOrigin: string[] = [this.frontUrl!];
  public _app: Express = express();

  /* Here to register any middleware */
  constructor() {
    console.log('MiddlewareConfig');
    this._app.use(response_time());
    this._app.use(express.json());
    this._app.use(BodyParser.urlencoded({ extended: true }));
    this._app.use(cookieParser());
    this._app.use(cors({ credentials: true, origin: this._corsOrigin }));
  }
}
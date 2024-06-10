import { Request, Response } from "express";
import { SportModel } from "../../Models/SportModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, } from "../../../config/statusMessages/messages";
import { JWT } from "../../helpers/JWT";
import { SPORTS_TYPE } from "../../../config/dataStructure/structure";

export class SportController extends SportModel {

  getSports = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'SPORT-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      return res.status(200).json(await this.all());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  getSport = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'SPORT-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      return res.status(200).json(await this.where('id', ID).get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  storeSport = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'SPORT-CREATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: SPORTS_TYPE = req.body;
      const STORE = await this.create(DATA);

      if (STORE?.error) return res.status(409).json({ error: { message: STORE.error } });
      return res.status(201).json(STORE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  updateSport = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'SPORT-UPDATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      const NEW_DATA: SPORTS_TYPE = req.body;

      const UPDATE = await this.update(ID, NEW_DATA);
      if (UPDATE?.error) return res.status(409).json({ error: { message: `${UPDATE.error}` } });

      return res.status(200).json(UPDATE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  deleteSport = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'SPORTS-DELETE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      const DELETE = await this.delete(ID);

      if (DELETE?.error) return res.status(409).json({ error: { message: DELETE.error } });

      return res.status(204).json({ message: SUCCESS_MESSAGES.DELETED });

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

}

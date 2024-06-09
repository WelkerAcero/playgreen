import { Request, Response } from "express";
import { EventModel } from "../../Models/EventModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, } from "../../../config/statusMessages/messages";
import { JWT } from "../../helpers/JWT";
import { EVENTS_TYPE } from "../../../config/dataStructure/structure";

export class EventController extends EventModel {

  getEvents = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'EVENT-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      return res.status(200).json(await this.with('Sports').get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  getEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'EVENT-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      return res.status(200).json(await this.with('Sports').where('id', ID).get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  storeEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'EVENT-CREATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: EVENTS_TYPE = req.body;
      const STORE = await this.create(DATA);

      if (STORE?.error) return res.status(409).json({ error: { message: STORE.error } });
      return res.status(200).json(STORE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  updateEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'EVENT-UPDATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      const NEW_DATA: EVENTS_TYPE = req.body;

      const UPDATE = await this.update(ID, NEW_DATA);
      if (UPDATE?.error) return res.status(409).json({ error: { message: `${UPDATE.error}` } });

      return res.status(200).json(UPDATE)

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  deleteEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'EVENT-DELETE'))) {
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

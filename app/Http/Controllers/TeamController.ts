import { Request, Response } from "express";
import { TeamModel } from "../../Models/TeamModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, } from "../../../config/statusMessages/messages";
import { TEAMS_TYPE } from "../../../config/dataStructure/structure";
import { JWT } from "../../helpers/JWT";

export class TeamController extends TeamModel {

  getTeams = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'TEAMS-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      return res.status(200).json(await this.all());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  getTeam = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'TEAMS-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      return res.status(200).json(await this.where('id', ID).get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  storeTeam = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'TEAMS-CREATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: TEAMS_TYPE = req.body;
      const STORE = await this.create(DATA);

      if (STORE?.error) return res.status(409).json({ error: { message: STORE.error } });
      return res.status(200).json(STORE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  updateTeam = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'TEAMS-UPDATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      const NEW_DATA: TEAMS_TYPE = req.body;

      const UPDATE = await this.update(ID, NEW_DATA);
      if (UPDATE?.error) return res.status(409).json({ error: { message: `${UPDATE.error}` } });

      return res.status(200).json(UPDATE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  
  deleteTeam = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'TEAMS-DELETE'))) {
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

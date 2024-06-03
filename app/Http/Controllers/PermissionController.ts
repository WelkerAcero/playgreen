import { Request, Response } from "express";
import { PermissionModel } from "../../Models/PermissionModel";
import { JWT } from "../../helpers/JWT";
import { ERROR_MESSAGES } from "../../../config/statusMessages/messages";

export class PermissionController extends PermissionModel {

    getPermissions = async (req: Request, res: Response): Promise<Response> => {
        try {
            const AUTH = req.headers.authorization;
            if (!(await JWT.validatePermission(AUTH, 'PERMISSION-READ'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
            }
            const RES = await this.all();
            return res.status(200).json(RES);
        } catch (error: any) {
            return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };
}

import { Request, Response } from "express";
import { UserModel } from "../../Models/UserModel";
import { JWT } from "../../helpers/JWT";
import { DB } from "../../helpers/DB";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";
import { DataOrganizer } from "../../helpers/DataOrganizer";
import { USER_TYPE } from '../../../config/dataStructure/structure';

export class UserController extends UserModel {

    getUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!(await JWT.validatePermission(req.headers.authorization, 'USER-READ'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
            }

            const USER_LIST = await this.with([
                {
                    Roles: {
                        include: {
                            RolesPermissions: {
                                include: {
                                    Permissions: true,
                                }
                            }
                        },
                    },
                },
            ]).get<USER_TYPE>();

            DataOrganizer.deleteProp(USER_LIST,
                [
                    'password', 'role_id', 'remember_token', 'Roles.createdAt', 'Roles.updatedAt', 'Roles.id',
                    'Roles.RolesPermissions.id', 'Roles.RolesPermissions.role_id', 'Roles.RolesPermissions.permission_id',
                    'Roles.RolesPermissions.createdAt', 'Roles.RolesPermissions.updatedAt'
                ]
            );

            return res.status(200).json(USER_LIST);
        } catch (error: any) {
            return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    getUserRoles = async (req: Request, res: Response): Promise<any> => {
        try {
            const AUTH: string | undefined = req.headers.authorization;
            /* Si es superAdmin => puede crear rol super admin, sino entonces solo admin y otros */
            if (await JWT.validatePermission(AUTH, 'ROLE-READ')) {
                return res.status(200).json(await DB.table('Roles').select(['id', 'rol_name']).get());
            }

            // if (await JWT.validatePermission(AUTH, 'CREATE')) {
            //     return res.status(200).json(await DB.table('Roles').select(['id', 'rol_name']).whereNot('rol_name', 'SuperAdmin').get());
            // }

        } catch (error: any) {
            return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    updateUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!(await JWT.validatePermission(req.headers.authorization, 'USER-UPDATE'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
            }
            const ID: number = parseInt(req.params.id);
            const NEW_DATA: USER_TYPE = req.body;

            const SAVE = await this.update(ID, NEW_DATA);
            if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

            return res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED });
        } catch (error: any) {
            return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<any> => {
        try {
            if (!(await JWT.validatePermission(req.headers.authorization, 'USER-DELETE'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
            }
            console.log('req.params:', req.params);
            const ID = parseInt(req.params.id);
            const DELETE = await this.delete(ID);
            if (DELETE?.error) return res.status(409).json({ error: { message: `${DELETE.error}` } });

            return res.status(204).json({ message: SUCCESS_MESSAGES.DELETED });
        } catch (error: any) {
            return res.status(409).json({ error: { message: error } });
        }
    };
}

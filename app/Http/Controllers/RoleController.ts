import { Request, Response } from "express";
import { RoleModel } from "../../Models/RoleModel";
import { DB } from "../../helpers/DB";
import { JWT } from "../../helpers/JWT";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";
import { ROLES_PERMISSIONS_TYPE, ROLES_TYPE } from "../../../config/dataStructure/structure";

export class RoleController extends RoleModel {

    getRoles = async (req: Request, res: Response): Promise<Response> => {
        try {
            const AUTH = req.headers.authorization;
            if (!(await JWT.validatePermission(AUTH, 'ROLE-READ'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
            }

            if (JWT.user.Roles!.rol_name === 'SUPER ADMIN') {
                return res.status(200).json(await this.with([{ RolesPermissions: { include: { Permissions: true } } }]).get());
            } else {
                return res.status(200).json(await this.with([
                    {
                        RolesPermissions: {
                            where: {
                                role_id: JWT.user.Roles!.id
                            },
                            include: {
                                Permissions: true
                            }
                        }
                    }
                ]).whereNot('rol_name', 'SUPER ADMIN').get());
            }

        } catch (error: any) {
            return res.status(409).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    getRole = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!(await JWT.validatePermission(req.headers.authorization, 'ROLE-READ'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
            }
            const id = parseInt(req.params.id);
            return res.json(await this.where('id', id).get());
        } catch (error: any) {
            return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    storeRoleAndPermissions = async (req: Request, res: Response): Promise<Response> => {
        try {
            const AUTH = req.headers.authorization;
            if (!(await JWT.validatePermission(AUTH, 'ROLE-CREATE'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
            }

            const ROLE = { rol_name: req.body.rol_name };
            const SAVE = await this.create(ROLE);
            if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

            const PERMISSIONS: number[] = req.body.permission_id;

            console.log("ROL CREADO:", SAVE);
            PERMISSIONS.forEach(async (permission: number) => {
                await DB.table('RolesPermissions').create({ role_id: SAVE.id, permission_id: permission }, false);
            });

            return res.status(201).json({ message: SUCCESS_MESSAGES.STORED });
        } catch (error) {
            return res.status(401).json({ message: ERROR_MESSAGES.CLIENT_SERVER_ERROR });
        }
    };

    updateRoleAndPermissions = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!(await JWT.validatePermission(req.headers.authorization, 'ROLE-UPDATE'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
            }

            /* Para actualzar rol name en caso de cambios*/
            const ROLE_ID = parseInt(req.body.role_id);
            /* Para actualizar permisos entre rol y permisos */
            const PERMISSIONS: number[] = req.body.permissions_list;
            const REQUEST_CURRENT_PERMISSIONS = await DB.table('Roles').with(['RolesPermissions']).where('id', ROLE_ID).get<ROLES_TYPE>();
            const GET_CURRENT_PERMISSIONS: ROLES_PERMISSIONS_TYPE[] = REQUEST_CURRENT_PERMISSIONS[0].RolesPermissions!;

            const permissionsToAdd = PERMISSIONS.filter(permission => !GET_CURRENT_PERMISSIONS.some(p => p.permission_id === permission));
            const permissionsToRemove = GET_CURRENT_PERMISSIONS.filter(permission => !PERMISSIONS.includes(permission.permission_id));
            // Agregar nuevos permisos

            for (const permission_to_store of permissionsToAdd) {
                const DATA_TO_CREATE = { role_id: ROLE_ID, permission_id: permission_to_store };
                const SAVE = await DB.table('RolesPermissions').create(DATA_TO_CREATE, false);
                if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });
            }

            // Eliminar permisos del rol
            for (const permissionToRemove of permissionsToRemove) {
                const TO_DELETE = { role_id: ROLE_ID, permission_id: permissionToRemove.permission_id };
                const DELETE = await DB.table('RolesPermissions').deleteMany(TO_DELETE);
                if (DELETE.error) return res.status(409).json({ error: { message: `${DELETE.error}` } });
            }

            return res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED });

        } catch (error: any) {
            return res.status(409).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    deleteRole = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!(await JWT.validatePermission(req.headers.authorization, 'ROLE-DELETE'))) {
                return res.status(401).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
            }

            const ROLE_ID: number = parseInt(req.params.id);
            const ROLES_PERMISSIONS: ROLES_PERMISSIONS_TYPE[] = Object.values(await DB.table('RolesPermissions').where('role_id', ROLE_ID).get());
            for (const obj of ROLES_PERMISSIONS) if (obj.id) await DB.delete(obj.id);

            const DELETE = await this.delete(ROLE_ID);
            if (DELETE.error) return res.status(409).json({ error: { message: DELETE.error } });

            return res.status(204).json({ message: SUCCESS_MESSAGES.DELETED });
        } catch (error: any) {
            return res.status(400).json({ error: { message: error } });
        }
    };

}
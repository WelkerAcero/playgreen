import { Request, Response } from "express";
import { UserModel } from "../../Models/UserModel";
import { JWT } from "../../helpers/JWT";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";
import { DataOrganizer } from "../../helpers/DataOrganizer";
import { USER_TYPE } from '../../../config/dataStructure/structure';
import { PasswordHandler } from "../../../config/inputHandler/PasswordHandler";
import { Encrypt } from "../../helpers/ENCRYPT";

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
                    'documentId', 'cellphone', 'address', 'birthDate', 'gender', 'username', 'password', 'role_id', 'remember_token', 'Roles.createdAt', 
                    'Roles.updatedAt', 'Roles.id', 'Roles.RolesPermissions.id', 'Roles.RolesPermissions.role_id', 'Roles.RolesPermissions.permission_id',
                    'Roles.RolesPermissions.createdAt', 'Roles.RolesPermissions.updatedAt'
                ]
            );

            return res.status(200).json(USER_LIST);
        } catch (error: any) {
            return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const AUTH_HEADER: string | undefined = req.headers.authorization;
            const ADMIN_USER: USER_TYPE = await JWT.decodeToken(AUTH_HEADER);

            if (!ADMIN_USER) return res.status(401).json({ error: { message: ERROR_MESSAGES.UNAUTHENTICATED } });
            if (!(await JWT.validatePermission(AUTH_HEADER, 'PROFILE-UPDATE'))) return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })

            if (req.body.email) req.body.email.replace(/\s+/g, '');

            const SAVE = await this.update(ADMIN_USER.id, req.body);
            if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

            DataOrganizer.deleteProp([SAVE], ['username', 'password', 'remember_token', 'role_id', 'country_id', 'createdAt', 'updatedAt', 'birthDate'])
            return res.status(200).json(SAVE);
        } catch (error: any) {
            return res.status(400).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    };

    updatePasswordProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            /* Recoger la autorización*/
            const AUTH_HEADER: string | undefined = req.headers.authorization;
            const ADMIN_USER: USER_TYPE = await JWT.decodeToken(AUTH_HEADER);
            delete ADMIN_USER.iat;

            if (!ADMIN_USER) return res.status(401).json({ error: { message: ERROR_MESSAGES.UNAUTHENTICATED } });
            if (!(await JWT.validatePermission(AUTH_HEADER, 'EDIT-PROFILE'))) return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })

            /* Validar el password actual antes de ingresar uno nuevo */
            const CURRENT_PASS: string = Encrypt.encryptPassword(req.body.oldPassword);
            const PASSWORD: string = req.body.password;

            if (CURRENT_PASS !== ADMIN_USER.password) return res.status(401).json({ error: { message: ERROR_MESSAGES.WRONG_CURRENT_PASSWORD } });
            if (!PasswordHandler.isPasswordValid(PASSWORD)) return res.status(401).json({ error: { message: ERROR_MESSAGES.INVALID_CHARACTERS } });

            const ENCRYPTED_PASSWORD: string = Encrypt.encryptPassword(PASSWORD);

            // Ordenar nuevo dato para insertar el nuevo password
            ADMIN_USER.password = ENCRYPTED_PASSWORD;
            return res.status(200).json(await this.update(ADMIN_USER.id, ADMIN_USER));
        } catch (error: any) {
            return res.status(400).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
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

    // deleteUser = async (req: Request, res: Response): Promise<any> => {
    //     try {
    //         if (!(await JWT.validatePermission(req.headers.authorization, 'USER-DELETE'))) {
    //             return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
    //         }
    //         console.log('req.params:', req.params);
    //         const ID = parseInt(req.params.id);
    //         const DELETE = await this.delete(ID);
    //         if (DELETE?.error) return res.status(409).json({ error: { message: `${DELETE.error}` } });

    //         return res.status(204).json({ message: SUCCESS_MESSAGES.DELETED });
    //     } catch (error: any) {
    //         return res.status(409).json({ error: { message: error } });
    //     }
    // };
}

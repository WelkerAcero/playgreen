import jwt from 'jsonwebtoken'
import { Model } from '../Models/Model';
import { ROLES_PERMISSIONS_TYPE, USER_TYPE } from '../../config/dataStructure/structure';
import dotenv from "dotenv";
dotenv.config();

export class JWT {
    private static secretKey: string = process.env.JWT_SECRET || '';
    public static user: USER_TYPE;

    static async createToken(payload: string | object): Promise<any> {
        return jwt.sign(payload, this.secretKey, { algorithm: 'RS256' });
    }

    static async decodeToken(token: string | undefined): Promise<any> {
        if (token) return jwt.verify(token.replace('Bearer ', ''), this.secretKey);
    }

    static async validatePermission(authorizationToken: string | undefined, permissionNeeded: string | string[]): Promise<boolean> {
        if (!(authorizationToken) || !(permissionNeeded)) return false;

        let permissions: string[] = [];
        const USER: USER_TYPE = await JWT.decodeToken(authorizationToken);
        if (!USER) return false;

        JWT.user = USER;
        // Envia la info del usuario al model
        Model.setUser(USER);

        /* Recorrer y extraer todo los permisos y compararlo con el que necesita */
        USER.Roles?.RolesPermissions!.forEach((obj: ROLES_PERMISSIONS_TYPE) => {
            permissions.push(obj.Permissions!.type);
        });

        let validationRes: boolean = true;
        console.log("User Permissions:", permissions);
        if (typeof (permissionNeeded) === 'string') if (!permissions.includes(permissionNeeded)) validationRes = false;
        if (Array.isArray(permissionNeeded)) permissionNeeded.forEach(permission => { if (!permissions.includes(permission)) validationRes = false; });
        
        return validationRes;
    }

    static async validateRole(role: string): Promise<boolean> {

        /* Extraer el role */
        const ROL_NAME = JWT.user.Roles!.rol_name;
        if (role == ROL_NAME) return true;
        return false;
    }
}
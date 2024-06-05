import { Request, Response } from "express";
import { UserModel } from "../../Models/UserModel";
import { DB } from "../../helpers/DB";
import { JWT } from "../../helpers/JWT";
import { Encrypt } from "../../helpers/ENCRYPT";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../config/statusMessages/messages';
import { EmailProvider } from "../../Providers/EmailProvider";
import { USER_TYPE } from "../../../config/dataStructure/structure";
import { PasswordHandler } from '../../../config/inputHandler/PasswordHandler';
import { DataOrganizer } from "../../helpers/DataOrganizer";

export class AuthController extends UserModel {
    private loginAttemptsByUser: Map<string, number> = new Map<string, number>();
    private readonly MAX_LOGIN_ATTEMPTS = 6;
    private usersWithRecoveryTokenVerified: USER_TYPE[] = [];
    private recoveryTokensList: string[] = [];

    registerNonCredentials = async (req: Request, res: Response): Promise<Response> => {
        try {
            const PASSWORD = req.body.password;
            if (!PasswordHandler.isPasswordValid(PASSWORD)) return res.status(401).json({ error: { message: ERROR_MESSAGES.INVALID_CHARACTERS } });

            const ENCRYPTED_PASSWORD: string = Encrypt.encryptPassword(PASSWORD);
            req.body.password = ENCRYPTED_PASSWORD;
            req.body.email.replace(/\s+/g, '');

            const DATA: USER_TYPE = req.body;
            const STORE = await this.create(DATA);
            if (STORE?.error) return res.status(409).json({ error: { message: `${STORE.error}` } });

            return res.status(201).json(STORE);
        } catch (error: any) {
            console.log(error);
            return res.status(400).json(error);
        }
    }

    registerAdmin = async (req: Request, res: Response): Promise<Response> => {
        try {
            const AUTH_HEADER: string | undefined = req.headers.authorization;
            const CLAIMS: string | undefined = await JWT.decodeToken(AUTH_HEADER);
            const PASSWORD = req.body.password;

            if (!CLAIMS) return res.status(401).json({ error: { message: ERROR_MESSAGES.UNAUTHENTICATED } });
            if (!(await JWT.validatePermission(AUTH_HEADER, 'USER-CREATE'))) return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
            if (!PasswordHandler.isPasswordValid(PASSWORD)) return res.status(401).json({ error: { message: ERROR_MESSAGES.INVALID_CHARACTERS } });

            const ENCRYPTED_PASSWORD: string = Encrypt.encryptPassword(PASSWORD);
            req.body.password = ENCRYPTED_PASSWORD;
            req.body.email.replace(/\s+/g, '');

            const DATA: USER_TYPE = req.body;
            const STORE = await this.create(DATA);
            if (STORE?.error) return res.status(409).json({ error: { message: `${STORE.error}` } });

            return res.status(201).json(STORE);
        } catch (error: any) {
            console.log(error);
            return res.status(400).json(error);
        }
    }

    /**
       * Función que recibe tablas como llaves y datos
       * @param {string} field recibe el valor de la columna con la que se evaluará la existencia email o username
       * @param {string} value recibe el valor string de email o username
    */
    private verifyUser = async (field: 'email' | 'username', value: string): Promise<USER_TYPE> => {
        const USER = Object.values(await DB.table('Users').with(
            [{
                Roles: {
                    select: {
                        id: true,
                        rol_name: true,
                        RolesPermissions: {
                            select: {
                                id: true,
                                role_id: true,
                                permission_id: true,
                                Permissions: true
                            }
                        }
                    }
                }
            }]).where(field, value).get<USER_TYPE>())[0];
        return USER;
    }


    private resetLoginAttempts = (username: string): void => {
        setTimeout(() => {
            this.loginAttemptsByUser.delete(username);
        }, 60000 * this.MAX_LOGIN_ATTEMPTS);
    }

    attemptsExceeded = (attempts: number, username: string): boolean => {
        if (attempts === this.MAX_LOGIN_ATTEMPTS) {
            this.resetLoginAttempts(username);
            return true;
        }
        return false;
    }

    authenticateAdmin = async (req: Request, res: Response): Promise<any> => {
        try {
            const USERNAME: string = req.body.username.replace(/\s+/g, '');
            let loginAttempts = this.loginAttemptsByUser.get(USERNAME) || 0;

            if (this.attemptsExceeded(loginAttempts, USERNAME)) {
                return res.status(429).json({ error: { message: ERROR_MESSAGES.MAX_ATTEMPTS_EXCEEDED } });
            }

            const ADMIN: USER_TYPE = await this.verifyUser('username', USERNAME);
            if (!ADMIN) {
                loginAttempts++;
                this.loginAttemptsByUser.set(USERNAME, loginAttempts);
                return res.status(401).json({ error: { message: ERROR_MESSAGES.WRONG_LOGIN_CREDENTIALS } });
            }

            if (ADMIN.password !== Encrypt.encryptPassword(req.body.password)) {
                loginAttempts++;
                this.loginAttemptsByUser.set(USERNAME, loginAttempts);
                return res.status(401).json({ error: { message: ERROR_MESSAGES.WRONG_LOGIN_CREDENTIALS } });
            }

            await DataOrganizer.deleteProp([ADMIN], ['id', 'password', 'remember_token']);
            const TOKEN = await JWT.createToken(ADMIN);

            /* resetea los intentos para este usuario */
            this.loginAttemptsByUser.delete(USERNAME);

            res.cookie('jwt', TOKEN, {
                sameSite: 'strict',
                secure: true,
                httpOnly: true,
                maxAge: 60000, // 1 min in miliseconds
                path: 'http://127.0.0.1:5173/dashboard'
            });

            return res.status(200).json(
                {
                    authenticate: true,
                    message: 'Successful login',
                    token: TOKEN,
                    expiresIn: 3600, // este valor se multplica * 1000 en el lado front 3600*1000 = 3600000s
                });
        } catch (error) {
            console.error(error);
            return res.status(409).json({ error: { message: ERROR_MESSAGES.MISSING_TOKEN } });
        }
    }

    setRememberPasswordToken = async (user: USER_TYPE): Promise<USER_TYPE> => {
        const characters = '!#*$A/*{B*C#}*DE*!{F*G#}*H$*{I*J#}*KL*{M*N#}/*O!P*{Q*R#}*ST*{U*$#}*V!W*{X*Y#}*Z0*{1*$!#}*23*{4*5#}*6$*{7!*8#}!*9#/!';
        const codeLength = 50; // Longitud del código deseado
        let code: string = '';

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        user.remember_token = code;
        delete user.updatedAt; delete user.createdAt;
        return user;
    }

    sendEmailToken = async (req: Request, res: Response): Promise<any> => {
        try {
            const RECOVERY_EMAIL: string = req.body.email;
            const ADMIN_DATA: USER_TYPE | undefined = await this.verifyUser('email', RECOVERY_EMAIL);
            if (!ADMIN_DATA) return res.status(404).json({ error: { message: ERROR_MESSAGES.WRONG_LOGIN_EMAIL } });

            const ADMIN_TOKEN_ESTABLISHED: USER_TYPE = await this.setRememberPasswordToken(ADMIN_DATA);
            if (ADMIN_TOKEN_ESTABLISHED.remember_token) {
                await this.update(ADMIN_TOKEN_ESTABLISHED.id, ADMIN_TOKEN_ESTABLISHED);

                const EMAIL: EmailProvider = new EmailProvider();
                EMAIL.sendEmail(
                    "SPORT BOOK APPLICATION",
                    RECOVERY_EMAIL,
                    "This is the token for you reset password",
                    "Remember this token should be copy & paste in the field: 'Verification Code'",
                    `<h3>This token is valid for 10 minutes after being received.</h3><br>
                    <h1>Verification token:</h1> <br> <b>${ADMIN_TOKEN_ESTABLISHED.remember_token}</b>`
                );

                await this.activateTokenExpiration(ADMIN_TOKEN_ESTABLISHED);
            }
            return res.status(200).json({ message: "Verification code has been sent to the email. This token will expire in 10 minutes from this moment" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: { message: error } });
        }
    }

    activateTokenExpiration = async (user: USER_TYPE): Promise<void> => {
        console.log('Establishing expiration time for remember token');
        setTimeout(async () => {
            user.remember_token = null;
            await this.update(user.id, user);
        }, 10000 * 60);
    }

    verifyRecoveryToken = async (req: Request, res: Response): Promise<object | void> => {
        if (req.body.recovery_token == null || req.body.recovery_token == undefined) return res.status(404).json({ error: { message: ERROR_MESSAGES.MISSING_RECOVERY_TOKEN } })

        const USER = Object.values(await this.where('remember_token', req.body.recovery_token).get<USER_TYPE>())[0];

        if (!USER) return res.status(404).json({ error: { message: ERROR_MESSAGES.MISSING_RECOVERY_TOKEN } })

        this.usersWithRecoveryTokenVerified.push(USER);
        this.recoveryTokensList.push(req.body.recovery_token);
        return res.status(200).json({ message: SUCCESS_MESSAGES.TOKEN_VERIFIED });
    }

    newRecoveryCredentials = async (req: Request, res: Response): Promise<any> => {
        try {
            let userIndex: number = -1;
            let tokenIndex: number = 0;
            const PASSWORD: string = req.body.password;

            if (!PasswordHandler.isPasswordValid(PASSWORD)) return res.status(409).json({ error: { message: ERROR_MESSAGES.INVALID_CHARACTERS } });

            for (let i = 0; i < this.recoveryTokensList.length; i++) {
                userIndex = this.usersWithRecoveryTokenVerified.findIndex(obj => obj.remember_token == this.recoveryTokensList[i]);
                if (userIndex != -1) tokenIndex = i;
            }

            const USER_DATA_TO_UPDATE: USER_TYPE = this.usersWithRecoveryTokenVerified[userIndex];
            USER_DATA_TO_UPDATE.password = Encrypt.encryptPassword(PASSWORD);

            delete USER_DATA_TO_UPDATE.createdAt;
            delete USER_DATA_TO_UPDATE.updatedAt;

            if (!(await this.update(USER_DATA_TO_UPDATE.id, USER_DATA_TO_UPDATE))) {
                return res.status(400).json({ error: { message: ERROR_MESSAGES.MISSING_RECOVERY_TOKEN } });
            }

            /* Eliminar este usuario de la lista y el token de la lista*/
            this.usersWithRecoveryTokenVerified.splice(userIndex, 1);
            this.recoveryTokensList.splice(tokenIndex, 1);
            return res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED });
        } catch (error) {
            return res.status(401).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
        }
    }


}



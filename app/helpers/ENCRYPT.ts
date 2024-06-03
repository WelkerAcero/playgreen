import crypto from 'crypto';
export class Encrypt {

    static encryptPassword = (password: string): string => {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const encryptedPassword = hash.digest('hex');
        return encryptedPassword;
    }

    static generateCSRFToken(): string {
        return crypto.randomBytes(64).toString('hex');
    }
}
export class PasswordHandler {

    static isMinLengthValid(newPassword: string) {
        return newPassword.length >= 8;
    }

    static isUpperCaseValid(newPassword: string) {
        return /[A-ZÑ]/.test(newPassword);
    }

    static isNumberValid(newPassword: string) {
        return /[0-9]/.test(newPassword);
    }

    static isSpecialCharValid(newPassword: string) {
        return /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(newPassword);
    }

    static isPasswordValid(newPassword: string) {
        return (
            this.isMinLengthValid(newPassword) &&
            this.isUpperCaseValid(newPassword) &&
            this.isNumberValid(newPassword) &&
            this.isSpecialCharValid(newPassword)
        );
    }
}
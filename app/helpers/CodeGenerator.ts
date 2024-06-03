import { DB } from "./DB";

export class CodeGenerator {
    private static generateRandomString(length: number): string {
        const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const excludedCharacters = "()*/$%&{}´´[]``-_.";
        const characters = allowedCharacters.split("").filter(char => !excludedCharacters.includes(char));

        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        return result;
    }

    static setCode = async (table: string, columName: string, length: number): Promise<string> => {
        const RANDOM_STRING: string = this.generateRandomString(100);
        const codeLength = length; // Longitud del código deseado
        let code: string = '';
        let repeat: boolean = false;
        do {
            code = '';
            for (let i = 0; i < codeLength; i++) {
                const randomIndex = Math.floor(Math.random() * RANDOM_STRING.length);
                code += RANDOM_STRING[randomIndex];
            }
            const VERIFY_EXISTENCE: any = await DB.table(table).where(columName, code).get();
            if (Object.values(VERIFY_EXISTENCE).length > 0) repeat = true;
        } while (repeat);

        return code;
    }
}

import { RULE_TYPE, VALIDATION_TYPE } from '../dataStructure/structure';

export class InputHandler {

    static async validateInputs(data: any, validation?: any): Promise<VALIDATION_TYPE> {

        if (typeof validation == 'object') {
            for (const key in data) {
                const RULE: RULE_TYPE = validation[key];
                /* Validación de campos para Users */
                if (key == 'documentId') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Cédula" debe estar entre ${RULE.min} a ${RULE.max} números`), valid: false };
                if (key == 'name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'lastname') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Apellido", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'email') if (!this.email(data[key], RULE)) return { error: this.message('Email contiene caracteres inválidos'), valid: false };
                if (key == 'cellphone') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Celular"`), valid: false };
                if (key == 'address') if (!this.stringWithSpecialSimbols(data[key], RULE)) return { error: this.message(`"Dirección"`), valid: false };
                if (key == 'gender') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Género"`), valid: false };
                if (key == 'birthDate') if (!this.stringWithSpecialSimbols(data[key], RULE)) return { error: this.message(`"Fecha de nacimiento"`), valid: false };
                if (key == 'city') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Ciudad"`), valid: false };
                if (key == 'username') if (!this.stringWithNumbers(data[key], RULE)) return { error: this.message(`"Nombre de usuario"`), valid: false };
                if (key == 'password') if (!this.stringWithSpecialSimbols(data[key], RULE)) return { error: this.message(`"Clave o contraseña"`), valid: false };


                /* Validación de campos para Transacciones */
                if (key == 'amount') if (!this.onlyDecimalNumbers(data[key], RULE)) return { error: this.message(`"amount"`), valid: false };
                if (key == 'amount_money') if (!this.onlyDecimalNumbers(data[key], RULE)) return { error: this.message(`"amount"`), valid: false };
            }
        }
        return { error: '', valid: true };
    }

    static validateFields(data: object, allowedFields: string[]): VALIDATION_TYPE {
        for (let property in data) {
            if (!allowedFields.includes(property)) {
                const RESPONSE = { error: `El campo: "${property}" no está listado como parámetro permitido`, valid: false }
                return RESPONSE;
            }
        }
        return { error: '', valid: true };
    }

    //////////////////////////// VALUES VALIDATION ////////////////////////////////////////////
    static email(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (!(rule.type == typeof field)) return false;
        const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return regex.test(field);
    }

    static booleans(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (!(rule.type == typeof field)) return false;
        return true
    }

    static stringWithNumbers(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[a-zA-ZÑñ0-9]+$/g;
        return regex.test(field);
    }

    static noSpecialSimbols(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[a-zA-ZÑñ0-9\s.,-]+$/gi
        return regex.test(field);
    }

    static stringWithSpecialSimbols(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[a-zA-ZÑñ0-9\s.,-@#$%^&*()_+=\[\]{}|;:'"\\<>?/`~!]+$/gi
        return regex.test(field);
    }

    static onlyNumbers(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[0-9]+$/g;
        return regex.test(field);
    }

    static onlyDecimalNumbers(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min && field.length < rule.min) return false;
        if (rule.max && field.length > rule.max) return false;

        // Expresión regular para permitir números decimales
        const regex = /^\d*\.?\d+$/;
        return regex.test(field);
    }

    static dateTime(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        return true;
    }

    static letterString(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        field.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const regex = /^[a-zA-ZñÑ]+(?:\s[a-zA-ZñÑ]+)*$/g
        return regex.test(field);
    }

    static message(field: string): string {
        return `Error en el campo: ${field}`
    }
}
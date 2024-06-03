import { PrismaClient } from '@prisma/client';
import { VALIDATION_TYPE } from '../../config/dataStructure/structure';
import { InputHandler } from '../../config/inputHandler/ValidateInputs';
import { PrismaErrorHandler } from '../../config/PrismaErrorHandler';

const PRISMA = new PrismaClient();

export class DB {
    private static dbConnection: any = PRISMA;
    private static dbTable: any;
    private static _whereCondition: any = {};
    private static _withRelation: any = {};
    private static _tableField: any = {};

    static async importModelRules(targetTable: string): Promise<any> {
        try {
            if (targetTable.endsWith('ies')) {
                targetTable = targetTable.replace(/ies$/, "yModel");
            } else {
                targetTable = `${targetTable.slice(0, -1)}Model`;
            }
            const MODULE_PATH = `../Models/${targetTable}`;
            // Importa el módulo de forma asíncrona
            const MODULE = await import(MODULE_PATH);
            const CLASS = MODULE[`${targetTable}`];

            // Crea una instancia de la clase
            let objInstance: any = new CLASS();
            const RULES: object = objInstance.allowedRules;
            objInstance = null;
            return RULES;

        } catch (error: any) {
            console.error("Error al importar el módulo:", error);
            return error;
        }
    }

    static async validateRules(table: any, values: {}): Promise<VALIDATION_TYPE> {
        const RULES: object = await this.importModelRules(table.name.toString());
        const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(values, RULES);
        if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}`, valid: false };
        return { error: ``, valid: true };
    }

    static table(targetTable: string): typeof DB {
        this.dbTable = null;
        this._withRelation = {};
        this._whereCondition = {};
        DB.dbConnection = PRISMA;

        const newTable = DB.dbConnection[targetTable];
        if (newTable) {
            DB.dbTable = newTable;
        } else {
            console.error(`La tabla ${targetTable} no existe.`);
        }
        return this;
    }

    static select(fields: string[] | string): typeof DB {
        DB._tableField = [];
        if (typeof fields !== 'string') {
            fields.forEach(element => {
                DB._tableField = {
                    ...DB._tableField,
                    [element]: true
                }
            });
        } else {
            DB._tableField = {
                [fields]: true
            }
        }

        return this;
    }

    static whereIn(columnName: string, values: (string | number | boolean | Date)[]): typeof DB {
        DB._whereCondition = {
            ...DB._whereCondition,
            [columnName]: {
                in: values
            }
        };
        return this;
    }

    static where(columnName: string, value: string | number | boolean | Date): typeof DB {
        DB._whereCondition = {
            ...DB._whereCondition,
            [columnName]: value
        }

        return this;
    }

    static buildWhere(manualQuery: object): typeof DB {
        DB._whereCondition = {
            ...DB._whereCondition,
            ...manualQuery
        };
        return this;
    }

    static whereOr(columnName: string, value: string | number | boolean): typeof DB {
        DB._whereCondition = {
            OR: [
                { ...DB._whereCondition },
                {
                    [columnName]: value
                },
            ]
        }
        return this;
    }

    static whereNot(columnName: string, value: string | number | boolean): typeof DB {
        DB._whereCondition = {
            NOT: {
                [columnName]: value
            }
        }
        return this;
    }

    static with(tableRelation: string[] | any): typeof DB {
        tableRelation.forEach((element: string) => {
            if (typeof element === 'string') {
                DB._withRelation[element] = true;
            } else {
                Object.assign(DB._withRelation, element)
            }
        });
        return this;
    }

    static async all(): Promise<DB> {
        try {
            return DB.dbTable.findMany();
        } catch (error: any) {
            console.error(error);
            return error;
        }
    }

    static async executeQuery(pageSize?: number): Promise<DB> {
        try {
            const relation = Object.keys(DB._withRelation).length > 0 ? DB._withRelation : false;
            const options: any = {
                where: DB._whereCondition,
                include: relation,
            };

            if (Object.values(this._tableField).length > 0) Object.assign(options, { select: this._tableField });

            if (pageSize !== undefined) {
                const page: number = 1;
                options.skip = (page - 1) * pageSize;
                options.take = pageSize;
            }

            DB._whereCondition = {};
            DB._tableField = {};
            DB._withRelation = {};
            return await DB.dbTable.findMany(options);

        } catch (error: any) {
            console.log(error);
            return error;
        }
    }

    static async get<T>(): Promise<T[]> {
        const result = await this.executeQuery();
        // Asumiendo que `result` es un array de tipo `T`
        return result as T[];
    }

    static async paginate<T>(pageSize: number): Promise<T[]> {
        const result = await this.executeQuery(pageSize);
        // Asumiendo que `result` es un array de tipo `T`
        return result as T[];
    }

    static async update(id: number, newData: object) {
        try {
            const MAIN_TABLE = DB.dbTable; // Guardar la referencia a la tabla principal
    
            if (DB.dbTable.name.toString().includes('_')) return await this.dbTable.update({ where: { id: id }, data: newData });
    
            const RULES: object = await this.importModelRules(DB.dbTable.name.toString());
            const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(newData, RULES);
            if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}` }
    
            // Restaurar la referencia a la tabla principal después de cualquier operación que la pueda cambiar
            DB.dbTable = MAIN_TABLE;
    
            const result = await this.dbTable.update({
                where: {
                    id: id,
                },
                data: newData,
            });
            return result;
        } catch (error: any) {
            console.log(error);
            return PrismaErrorHandler.error(error);
        }
    }

    static async create(commingData: object, validateRules: boolean = true): Promise<any> {
        try {
            let rules: object = {};
            if (validateRules) rules = await this.importModelRules(DB.dbTable.name.toString());
            const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(commingData, rules);
            if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}`, valid: false }
            return await this.dbTable.create({ data: commingData });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    static async createMany(commingData: object): Promise<any> {
        try {
            if (DB.dbTable.name.toString().includes('_')) return await this.dbTable.createMany({ data: commingData });
            const RULES: object = await this.importModelRules(DB.dbTable.name.toString());
            const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(commingData, RULES);
            if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}` }
            return await this.dbTable.createMany({ data: commingData });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    static async deleteMany(dataToDelete: object) {
        try {
            return await this.dbTable.deleteMany({ where: dataToDelete, });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    static async delete(id: number, column?: string) {
        try {
            if (column) return await this.dbTable.delete({ where: { [column]: id }, });
            return await this.dbTable.delete({ where: { id: id }, });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    /**
 * Función que recibe tablas como llaves y datos
 * @param {string[]} tables recibe los nombres en un array en el siguiente orden: Tabla1, Tabla2 y de último
 * se recibe la tabla que tendrá los valores id de las tablas 1 y 2
 * @param {object} data recibe un objeto con nombres de Llaves iguales a las tablas definidas
 * en la llave1 el cual debe ser igual al nombre de tabla1 debe ser solo de tipo Objeto, mientras que la tabla 2 y 3
 * reciben un array de objetos: table[1] = [{}] y table[2] = [{}]
 * 
 * @param {object} foreign1 nombre de la columna foranea que recibe el id de la relación entre la tabla en la posició tables[0]
 * @param {string}  foreign2 nombre de la columna foranea que recibe el id de la relación entre la tabla en la posició tables[1]
 * @returns {object} devuelve los datos almacenados en la tables[0]
  */
    static async manyToManyStoreTransaction(tables: string[], data: any[], foreign1: string, foreign2: string): Promise<any> {
        try {
            let validation: VALIDATION_TYPE = { error: 'All is well', valid: true };
            let i: number = 0;
            let dataStored: any = {};

            // VALIDATING IF TABLES EXIST IN DATABASE
            for (let index = 0; index < tables.length; index++) {
                if (!PRISMA.hasOwnProperty(tables[index])) return validation = { error: 'One or both of the provided table names are not valid.', valid: false };
            }

            if (!validation.valid) return validation;

            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION OF THEIR VALUES
            console.log('Inicio de VALUES VALIDATION...');
            do {
                for (const obj of Object.values(data)) {
                    const DATA = obj;
                    const DATA_STRUCTURE = DATA[tables[i]];

                    if (Array.isArray(DATA_STRUCTURE)) {
                        for (let j = 0; j < DATA_STRUCTURE.length; j++) {
                            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[tables[i]], DATA_STRUCTURE[j]);
                            if (!VALIDATION_MODEL1.valid) return validation = { error: `${VALIDATION_MODEL1.error}`, valid: false };
                        }
                    } else {
                        const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[tables[i]], DATA_STRUCTURE);
                        if (!VALIDATION_MODEL1.valid) return validation = { error: `${VALIDATION_MODEL1.error}`, valid: false };
                    }
                }
                i++;
            } while (i < tables.length && validation.valid);

            if (!validation.valid) return validation;

            i = 0;
            console.log('Inicio de transacción...');
            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                do {
                    for (const obj of Object.values(data)) {
                        const TABLE_MODEL = (tx as any)[tables[i]];
                        const DATA_STRUCTURE = obj[tables[i]];

                        console.log('DATA_STRUCTURE', DATA_STRUCTURE);

                        if (Array.isArray(DATA_STRUCTURE)) {
                            for (let index = 0; index < DATA_STRUCTURE.length; index++) {

                                const STORED = await TABLE_MODEL.create({ data: DATA_STRUCTURE[index] });
                                Object.assign(dataStored, { [TABLE_MODEL.name]: STORED });

                                // Si existe la creación exitosa de table1 y table2 entonces usar sus id en la tabla3
                                if (dataStored[tables[0]] && dataStored[tables[1]]) {
                                    const TABLE_MODEL_RELATIONED = (tx as any)[tables[2]]
                                    const DATA_TABLE_3: any[] = obj[tables[2]];

                                    await TABLE_MODEL_RELATIONED.create({ data: { ...DATA_TABLE_3[index], [foreign1]: dataStored[tables[0]].id, [foreign2]: dataStored[tables[1]].id } });
                                }
                            }
                        } else {
                            const STORED = await TABLE_MODEL.create({ data: DATA_STRUCTURE });
                            Object.assign(dataStored, { [TABLE_MODEL.name]: STORED });
                        }
                    }
                    i++;
                } while (i < tables.length - 1 && validation.valid);
                return dataStored.MedicalHistories;
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    /**
     * Función que recibe tablas como llaves y datos
     * @param {string} table1 nombre de la tabla1 de DB 
     * @param {object} dataTable1 recibe los datos de la tabla1 
     * @param {string} table2 nombre de la tabla2 de DB
     * @param {object} dataTable1 recibe los datos de la tabla2
     * @param {string} foreignName Recibe el nombre de la columna que es foranea en la tabla2 que depende de la creación de la tabla1
     * @returns {object} devuelve la relación con la tabla1 que tiene el modelo donde se esta usando la función
      */
    static async interactiveStoreTransaction(table1: string, dataTable1: object, table2: string, dataTable2: object, foreignName: string): Promise<any> {
        try {
            // table1 and table2 must have the data table name, example: Doctors, Users
            if (!PRISMA.hasOwnProperty(table1) || !PRISMA.hasOwnProperty(table2)) {
                return { error: 'One or both of the provided table names are not valid.', valid: false }
            }
            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[table1], dataTable1);
            if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

            const VALIDATION_MODEL2 = await this.validateRules((PRISMA as any)[table2], dataTable2);
            if (!VALIDATION_MODEL2.valid) return { error: `${VALIDATION_MODEL2.error}` }

            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                const TABLE_MODEL_1 = (tx as any)[table1];
                const TABLE_MODEL_2 = (tx as any)[table2];

                const STORED_TABLE_1 = await TABLE_MODEL_1.create({ data: dataTable1 });
                await TABLE_MODEL_2.create({ data: { ...dataTable2, [foreignName]: STORED_TABLE_1.id } });

                return Object.values(await this.table(table1).with([table2]).where('id', STORED_TABLE_1.id).get<any>())[0];
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    static async simpleStoreTransaction(tableName: string, data: object, foreignTable: string, foreignId: number): Promise<any> {
        try {
            // table1 and table2 must have the data table name, example: Doctors, Users
            if (!PRISMA.hasOwnProperty(tableName)) {
                return { error: 'One or both of the provided table names are not valid.', valid: false }
            }
            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[tableName], data);
            if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                const TABLE_MODEL = (tx as any)[tableName];
                const STORED_TABLE = await TABLE_MODEL.create(
                    {
                        data: {
                            ...data, [foreignTable]: {
                                connect: { id: foreignId } // Pasar el objeto completo de MedicalHistories
                            }
                        }
                    });
                console.log(`${tableName}:`, STORED_TABLE);
                return STORED_TABLE;
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }
}
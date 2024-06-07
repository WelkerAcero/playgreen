import { PrismaClient, Prisma } from '@prisma/client';
import { VALIDATION_TYPE, USER_TYPE } from '../../config/dataStructure/structure';
import { InputHandler } from '../../config/inputHandler/ValidateInputs';
import { PrismaErrorHandler } from '../../config/PrismaErrorHandler';

const PRISMA: PrismaClient = new PrismaClient();

export class Model {
  private _whereCondition: any = {};
  private _withRelation: any = {};
  private _tableField: any = {};
  private fields: string[];
  private rules: object = {};
  private dbTable: any;

  public static user: USER_TYPE;

  protected prisma = Prisma;
  protected prismaClient: PrismaClient = PRISMA;
  protected relation: string[] | string = '';

  constructor() {
    this.dbTable = null;
    this.fields = [];
  }

  protected setTargetDbTable(targetDbTable: any): void {
    this.dbTable = null;
    this.dbTable = targetDbTable;
  }

  protected setFields(fields: string[]): void {
    this.fields = fields;
  }

  protected setRules(rules: object): void {
    this.rules = rules;
  }

  async getUser(): Promise<USER_TYPE> {
    return Model.user;
  }

  static async setUser(user: USER_TYPE): Promise<void> {
    Model.user = user;
  }

  async saveUserChanges(action: string, module: string): Promise<void> {
    const USER_TYPE = await this.getUser();
    const DATA_TO_STORE = {
      user_document_id: USER_TYPE.documentId,
      user_name: USER_TYPE.name,
      user_lastname: USER_TYPE.lastname,
      action,
      module,
    }
    // const CHANGES = await this.prisma.historyUserChanges.create({ data: DATA_TO_STORE });
    // if (CHANGES) console.log('Los cambios del usuario han sido guardados:', CHANGES);
  }

  select(fields: string[] | string): Model {
    this._tableField = [];
    if (typeof fields !== 'string') {
      fields.forEach(element => {
        this._tableField = {
          ...this._tableField,
          [element]: true
        }
      });
    } else {
      this._tableField = { [fields]: true }
    }
    return this;
  }

  whereNot(columnName: string, value: string | number | boolean): Model {
    this._whereCondition = {};
    this._whereCondition = {
      NOT: { [columnName]: value }
    }
    return this;
  }

  where(columnName: string, value: string | number | boolean | Date, manualQuery?: object): Model {
    if (manualQuery) {
      this._whereCondition = manualQuery;
    } else {
      this._whereCondition = {};
      this._whereCondition = {
        ...this._whereCondition,
        [columnName]: value
      }
    }
    return this;
  }

  buildWhere(manualQuery: object): Model {
    this._whereCondition = {
      ...this._whereCondition,
      ...manualQuery
    };
    return this;
  }

  whereOr(columnName: string, value: string | number | boolean | Date): Model {
    this._whereCondition = {
      OR: [
        { ...this._whereCondition },
        { [columnName]: value },
      ]
    }
    return this;
  }

  protected with(tableRelation: string[] | any): Model {
    tableRelation.forEach((element: string) => {
      if (typeof element === 'string') {
        this._withRelation[element] = true;
      } else {
        Object.assign(this._withRelation, element)
      }
    });
    return this;
  }

  private async executeQuery(pageSize?: number, page: string = '1'): Promise<Model> {
    try {
      let totalValues: number = 0;
      const relation = Object.keys(this._withRelation).length > 0 ? this._withRelation : false;
      let options: any = {
        where: this._whereCondition,
        include: relation,
      };

      if (Object.values(this._tableField).length > 0) Object.assign(options, { select: this._tableField });

      if (pageSize !== undefined) {
        totalValues = this.dbTable.count();
        const currentPage: number = parseInt(page);
        options.take = pageSize;
        options.skip = (currentPage - 1) * pageSize;
      }

      this._whereCondition = {};
      this._withRelation = {};
      return await this.dbTable.findMany(options);

    } catch (error: any) {
      return error;
    }
  }

  async get<T>(): Promise<T[]> {
    const result: any = await this.executeQuery();
    // Asumiendo que `result` es un array de tipo `T`
    return result as T[];
  }


  async paginate(pageSize: number, page?: string | undefined): Promise<Model | any> {
    if (typeof page === 'undefined') page = '1';
    return await this.executeQuery(pageSize, page);
  }

  protected async create(commingData: object): Promise<any> {
    try {
      const VALIDATE_FIELDS: VALIDATION_TYPE = InputHandler.validateFields(commingData, this.fields);
      if (!VALIDATE_FIELDS.valid) return { error: `${VALIDATE_FIELDS.error}` }

      const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(commingData, this.rules);
      console.log("INPUT_VALIDATION:", INPUT_VALIDATION)
      if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}` }

      //this.saveUserChanges('create', this.dbTable.name);
      return await this.dbTable.create({ data: commingData });
    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  protected async update(id: number, newData: object) {
    try {
      const VALIDATE_FIELDS: VALIDATION_TYPE = InputHandler.validateFields(newData, this.fields);
      if (!VALIDATE_FIELDS.valid) return { error: `${VALIDATE_FIELDS.error}` }

      const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(newData, this.rules);
      if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}` }

      const result: any = await this.dbTable.update({
        where: {
          id: id,
        },
        data: newData,
      });

      console.log('Datos actualizado:', result);
      return result;

    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  protected async delete(id: number) {
    try {
      /* SOFT DELETES */

      this.dbTable.$use(async (params: any, next: any) => {
        // Check incoming query type
        if (params.model == 'Post') {
          if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update'
            params.args['data'] = { deleted: true }
          }
          if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany'
            if (params.args.data != undefined) {
              params.args.data['deleted'] = true
            } else {
              params.args['data'] = { deleted: true }
            }
          }
        }
        return next(params)
      })

      // return await this.dbTable.delete({ where: { id } });
    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  protected async deleteMany(dataToDelete: object) {
    try {
      return await this.dbTable.deleteMany({ where: dataToDelete, });
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async importModelRules(targetTable: string): Promise<any> {
    try {
      if (targetTable.endsWith('ies')) {
        targetTable = targetTable.replace(/ies$/, "yModel");
      } else {
        targetTable = `${targetTable.slice(0, -1)}Model`;
      }
      const modulePath = `./${targetTable}`;

      // Importa el módulo de forma asíncrona
      const MODULE = await import(modulePath);
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

  protected async validateRules(table: any, values: {}): Promise<VALIDATION_TYPE> {
    const RULES: object = await this.importModelRules(table.name.toString());
    const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(values, RULES);
    if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}`, valid: false };
    return { error: ``, valid: true };
  }

  private async validateRulesInSeveral(data: any[], tables: string[]): Promise<VALIDATION_TYPE> {
    let i: number = 0;
    let validation: VALIDATION_TYPE = { error: 'All is well', valid: true };
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

    return validation;
  }

  /**
   * Función que recibe tablas como llaves y datos
   * @param {string[]} tables recibe los nombres de las tablas de las base de datos en un array en 
   * el siguiente orden: Tabla1, Tabla2 y de último se recibe la tabla que tendrá los valores Id's de las tablas 1 y 2
   * 
   * @param {object} data recibe objetos con nombres de llaves iguales a las tablas definidas.
   * La llave del objeto 1 debe tener el mismo nombre de tabla1. Debe ser solo de tipo Objeto, Ejemplo: { Patients: { } }
   * mientras que la tabla 2 y 3 esperan un array de objetos, table[1] = [{}] y table[2] = [{}]
   * 
   * @param {object} foreign1 nombre de la columna foranea que recibe el id de la relación entre la tabla en la posición tables[0]
   * @param {string}  foreign2 nombre de la columna foranea que recibe el id de la relación entre la tabla en la posición tables[1]
   * @returns {object} devuelve los datos almacenados en la tables[0]
  */
  protected async nestedStoreTransaction(tables: string[], data: any[], foreign1: string, foreign2: string, nestedTables?: any[]): Promise<any> {
    try {
      let i: number = 0;
      let dataStored: any = {};

      // VALIDATING IF TABLES EXIST IN DATABASE
      for (let i = 0; i < tables.length; i++) {
        if (!PRISMA.hasOwnProperty(tables[i])) return { error: 'One or both of the provided table names are not valid.', valid: false };
      }

      if (nestedTables && nestedTables.length > 0) {
        const TABLEs = Object.keys(nestedTables[0]);
        for (let i = 0; i < TABLEs.length; i++) {
          if (!PRISMA.hasOwnProperty(TABLEs[i])) return { error: 'One or both of the provided table in Nested tables names are not valid.', valid: false };
        }
      }

      const VALIDATE_RULES = await this.validateRulesInSeveral(data, tables);
      if (!VALIDATE_RULES.valid) return VALIDATE_RULES;

      /* START TRANSACTION PROCESS */
      i = 0;
      return await PRISMA.$transaction(async (tx: any) => {
        // Acceder a los modelos de Prisma dinámicamente
        do {
          for (const obj of Object.values(data)) {
            const TABLE_MODEL = (tx as any)[tables[i]];
            const DATA_STRUCTURE = obj[tables[i]];

            if (Array.isArray(DATA_STRUCTURE)) {
              for (let index = 0; index < DATA_STRUCTURE.length; index++) {

                console.log("DATA_STRUCTURE:", DATA_STRUCTURE);

                if (DATA_STRUCTURE[index].id) {
                  Object.assign(dataStored, { [TABLE_MODEL.name]: DATA_STRUCTURE[index] });
                } else {
                  const STORED = await TABLE_MODEL.create({ data: DATA_STRUCTURE[index] });
                  Object.assign(dataStored, { [TABLE_MODEL.name]: STORED });
                }

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

              // Si existe la creación exitosa de table1 y table2 entonces usar sus id en la tabla3
              if (dataStored[tables[0]] && dataStored[tables[1]]) {
                const TABLE_MODEL_RELATIONED = (tx as any)[tables[2]]
                const DATA_TABLE_3: any[] = obj[tables[2]];
                await TABLE_MODEL_RELATIONED.create(
                  {
                    data: {
                      ...DATA_TABLE_3,
                      [foreign1]: dataStored[tables[0]].id,
                      [foreign2]: dataStored[tables[1]].id
                    }
                  }
                );
              }
            }
          }
          i++;
        } while (i < 2);

        if (nestedTables && nestedTables.length > 0) {
          const TABLES = Object.keys(nestedTables[0]);

          const VALIDATE_RULES = await this.validateRulesInSeveral(nestedTables[0], tables);
          if (!VALIDATE_RULES.valid) return VALIDATE_RULES;

          for (let i = 0; i < TABLES.length; i++) {
            const TABLE_MODEL = (tx as any)[TABLES[i]];
            const DATA_STRUCTURE = nestedTables[0][TABLE_MODEL.name];

            if (Array.isArray(DATA_STRUCTURE)) {
              for (let i = 0; i < DATA_STRUCTURE.length; i++) {
                console.log("DATA:", ...DATA_STRUCTURE, tables[0]);
                await TABLE_MODEL.create({
                  data: {
                    ...DATA_STRUCTURE[i], [tables[0]]: {
                      connect: { id: dataStored[tables[0]].id }
                    }
                  }
                });
              }
            } else {
              if (Object.values(DATA_STRUCTURE).length > 0) {
                await TABLE_MODEL.create({
                  data: {
                    ...DATA_STRUCTURE, [tables[0]]: {
                      connect: { id: dataStored[tables[0]].id }
                    }
                  }
                });
              }
            }
          }
        }
      });
    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  /**
   * Función que recibe tablas como llaves y datos
   * @param {string} table1 nombre de la tabla1 de DB @param {string} table2 nombre de la tabla2 de DB
   * @param {object} dataTable1 recibe los datos de la tabla1 
   * @param {object} dataTable2 recibe los datos de la tabla2
   * @param {string} foreignName Recibe el nombre de la columna que es foranea en la tabla2 que depende de la creación de la tabla1
   * @returns {object} devuelve la relación con la tabla1 que tiene el modelo donde se esta usando la función
    */
  protected async interactiveStoreRelationalTransaction(table1: string, dataTable1: object, table2: string, dataTable2: object, foreignName: string): Promise<any> {
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

        const STORE_TABLE_1 = await TABLE_MODEL_1.create({ data: dataTable1 });
        await TABLE_MODEL_2.create({ data: { ...dataTable2, [foreignName]: STORE_TABLE_1.id } });

        return await this.with([table1]).where('id', STORE_TABLE_1.id).get();
      });
    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  protected async storeAndUpdateTransaction(table1: string, dataTable1: object, table2: string, updateData: object, updateField: string): Promise<any> {
    try {
      // Validar si las tablas existen en el cliente de Prisma
      if (!PRISMA.hasOwnProperty(table1) || !PRISMA.hasOwnProperty(table2)) {
        return { error: 'One or both of the provided table names are not valid.', valid: false };
      }
  
      // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
      const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[table1], dataTable1);
      if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

      const VALIDATION_MODEL2 = await this.validateRules((PRISMA as any)[table2], updateData);
      if (!VALIDATION_MODEL2.valid) return { error: `${VALIDATION_MODEL2.error}` }
  
      return await PRISMA.$transaction(async (tx) => {
        const TABLE_MODEL_1 = (tx as any)[table1];
        const TABLE_MODEL_2 = (tx as any)[table2];
  
        const STORE = await TABLE_MODEL_1.create({ data: dataTable1 });
        const UPDATE = await TABLE_MODEL_2.update({
          where: { [updateField]: (updateData as any)[updateField] },
          data: updateData
        });
  
        return { 
          [table1]: STORE,
          [table2]: UPDATE
         };
      });
    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  protected async interactiveUpdateTransaction(table1: string, dataTable1: any, table2: string, dataTable2: any): Promise<any> {
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

        const UPDATE_TABLE_1 = await TABLE_MODEL_1.update({ where: { id: dataTable1.id }, data: dataTable1 });
        const UPDATE_TABLE_2 = await TABLE_MODEL_2.update({ where: { id: dataTable2.id }, data: dataTable2 });

        return await this.with([table1]).where('id', UPDATE_TABLE_1.id).get();
      });
    } catch (error: any) {
      return PrismaErrorHandler.error(error);
    }
  }

  protected async simpleStoreTransaction(tableName: string, data: object, foreignTable: string, foreignId: number): Promise<any> {
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

  protected async all(): Promise<Model> {
    try {
      return await this.dbTable.findMany();
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

}

const FS = require('fs');
const { type } = require('os');
const prettier = require('prettier');

const CREAR_MODELO = async (modelNameParam) => {
    try {
        function getModelName(modelNameParam) {
            return `${modelNameParam[0].toUpperCase() + modelNameParam.slice(1)}Model`;
        }

        function getDbModelTable(modelNameParam) {
            if (modelNameParam.endsWith('y')) {
                const strSinY = modelNameParam.slice(0, -1);  // Elimina el último carácter 'y'
                modelNameParam = strSinY + 'ie'
            }
            //return modelNameParam[0].toUpperCase() + modelNameParam.slice(1).concat('s');
            return modelNameParam[0] + modelNameParam.slice(1).concat('s');
        }

        model = getModelName(modelNameParam);
        table = getDbModelTable(modelNameParam);
        if (table[-1] == 'y') table[-1] = 'ies'
        
        if (modelNameParam != '') {
            template = `import { Model } from "./Model";
                export class ${model} extends Model {
                    private targetDbTable: any = this.prismaClient.${table};
                    private allowedFields: string[] = [];
                    private allowedRules: object = {
                        'param1': { type: 'string', max: 10, min: 8 },
                        'param2': { type: 'string', max: 10, min: 8 },
                    }

                    constructor() {
                        super();
                        this.targetTable();
                        this.fieldsAllowed();
                        this.setRules();
                    }

                    targetTable(): void {
                        super.setTargetDbTable(this.targetDbTable);
                    }

                    fieldsAllowed(): void {
                        super.setFields(this.allowedFields);
                    }

                    setRules(): void {
                        super.setRules(this.allowedRules);
                    }
                }
            `;
        }

        let dataFile = `./app/Models/${model}.ts`;
        FS.writeFileSync(dataFile, prettier.format(template, { parser: 'typescript' }));

        return dataFile;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    CREAR_MODELO
}
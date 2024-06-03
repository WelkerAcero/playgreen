const FS = require('fs');
const { type } = require('os');
const prettier = require('prettier');

const CREAR_CONTROLADOR = async (controllerNameParam) => {
    try {
        function getControllerName(controllerNameParam) {
            return `${controllerNameParam[0].toUpperCase() + controllerNameParam.slice(1)}Controller`
        }

        function getModel(controllerNameParam) {
            return `${controllerNameParam[0].toUpperCase() + controllerNameParam.slice(1)}Model`
        }

        let controllerName = getControllerName(controllerNameParam);
        let model = getModel(controllerNameParam);

        if (controllerNameParam != '') {
            template = `import { Request, Response } from "express";
                import {${model}} from "../../Models/${model}";
                import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";
                import { JWT } from "../../helpers/JWT";

                export class ${controllerName} extends ${model}
                {
   
                }
            `;
        }

        let dataFile = `./app/Http/Controllers/${controllerName}.ts`;
        FS.writeFileSync(dataFile, prettier.format(template, { parser: 'typescript' }));

        return dataFile;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    CREAR_CONTROLADOR
}
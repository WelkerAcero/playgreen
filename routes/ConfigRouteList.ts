import { IRouter } from "express";
import path from 'path';
import fs from 'fs';

export default class ConfigRouteList {

    static getRoutes(): IRouter[] {
        let route: IRouter[] = [];
        // Ruta a la carpeta que contiene las rutas API
        const API_ROUTES_PATH = path.join(__dirname, '..', 'routes', 'api');

        // Leer los archivos de ruta de la carpeta
        const ROUTE_FILES = fs.readdirSync(API_ROUTES_PATH);

        // Importar y configurar cada archivo de ruta
        ROUTE_FILES.forEach((file: string) => {
            const ROUTE_PATH = path.join(API_ROUTES_PATH, file);
            const ROUTE_OBJ: IRouter = require(`${ROUTE_PATH}`).default;
            route.push(ROUTE_OBJ);
        });
        return route;
    }
}

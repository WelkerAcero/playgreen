const { CREAR_CONTROLADOR } = require('./createControllerProcess.js');
console.clear();
console.log(process.argv); // Datos enviados por consola
const argv = require('yargs')
    .options('c',
        {
            alias: 'controller',
            type: 'string',
            demandOption: true,
        })
    .check((argv, options) => {
        console.log('yargs', process.env.npm_config_controller)
        if (process.env.npm_config_controller.length === 0) {
            throw 'El controlador debe tener un nombre'
        }
        return true;
    }).argv;

CREAR_CONTROLADOR(process.env.npm_config_controller)
    .then(archiveName => console.log(`${archiveName} Controller creado exitosamente`))
    .catch((err) => console.log(err));
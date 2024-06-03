const { CREAR_MODELO } = require('./createModelProcess.js');
console.clear();
console.log(process.argv); // Datos enviados por consola
const argv = require('yargs')
    .options('m',
        {
            alias: 'model',
            type: 'string',
            demandOption: true,
        })
    .check((argv, options) => {
        console.log('yargs', process.env.npm_config_model)
        if (process.env.npm_config_model.length === 0) {
            throw 'El modelo debe tener un nombre'
        }
        return true;
    }).argv;

CREAR_MODELO(process.env.npm_config_model)
    .then(archiveName => console.log(`${archiveName} Modelo creado exitosamente`))
    .catch((err) => console.log(err));
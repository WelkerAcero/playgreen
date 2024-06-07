export const ERROR_MESSAGES = {
  PERMISSIONS_DENIED: "No posees los permisos para esta acción",
  DUPLICATE_DATA: "Existe un campo duplicado. Verifique e intente nuevamente",
  DATA_TOO_LONG: "Existe un dato que excede el máximo esperado",
  CLIENT_SERVER_ERROR: "El servidor no puede devolver una respuesta debido a un error del cliente",
  UNAUTHENTICATED: "No te encuentras autenticado por el sistema",
  WRONG_LOGIN_CREDENTIALS: "Las credenciales ingresadas son incorrectas",
  WRONG_LOGIN_EMAIL: "El email proporcionado es incorrecto o no existe",
  WRONG_LOGIN_PASSWORD: "La contraseña proporcionado es incorrecta",
  WRONG_CURRENT_PASSWORD: "La contraseña actual es inválida",
  MAX_ATTEMPTS_EXCEEDED: "Has excedido el número de intentos para esta petición, intenta más tarde. Tiempo restante: 6 minutos",
  MISSING_TOKEN: "Token no ha sido recibido o es invalido",
  MISSING_RECOVERY_TOKEN: "El Token de recuperación no coincide o ya ha expirado",
  CONSTRAINT_ON_DELETE: "El registro no puede ser eliminado. Primero debe eliminar los registros asociados a esta entidad",
  DELETE_NOT_EXIST: "El registro no existe, por favor actualiza tu página",
  INVALID_CHARACTERS: "El campo 'contraseña' posee caracteres no permitidos o no cumple con los criterios establecidos. Asegurate de usar una longitud de 8 y usar almenos 1 simbolo y números",
  INVALID_DATE: "La fecha ingresada es menor a la actual, por favor asegurese de ingresar una fecha valida",
  INCORRECT_DEPOSIT_AMOUNT: "El valor del monto a depositar no pueden ser valores negativos. Intente nuevamente",
  INCORRECT_WITHDRAW_AMOUNT: "El valor del a retirar debe ser mayor a 0. Intente nuevamente",
  BANK_ACCOUNT_DOESNT_EXIST: "El número de cuenta no existe, trata de ingresar una cuenta válida de tu usuario o crea una cuenta de banco a tu usuario",
  BANK_INSUFFICIENT_FUNDS: "Fondos insuficientes",
};

export const SUCCESS_MESSAGES = {
  TOKEN_VERIFIED: "El token ha sido verificado",
  STORED: "Registro guardado exitosamente",
  DELETED: "Registro eliminado exitosamente",
  UPDATED: "Datos actualizados correctamente",
};
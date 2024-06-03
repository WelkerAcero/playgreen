export class DataOrganizer {

    private static deleteProperties(deleteProperties: string[], obj: any): any {
        deleteProperties.forEach((property) => {
            const PROP = property.split('.');
            let currentObj = obj;

            for (let i = 0; i < PROP.length - 1; i++) {
                currentObj = currentObj[PROP[i]]; // Avanzar al siguiente nivel del objeto
            }

            if (Array.isArray(currentObj)) {
                // Si es un array, iteramos sobre sus elementos
                for (let i = 0; i < currentObj.length; i++) {
                    delete currentObj[i][PROP[PROP.length - 1]]
                }
            } else {
                delete currentObj[PROP[PROP.length - 1]];
            }
            // Eliminar la propiedad del objeto
            return currentObj
        });
    }

    public static async deleteProp(dataObj: any[], deleteProperties: string[] = []): Promise<any[]> {
        let dataOrganized: any[] = [];

        for (const obj of dataObj) {
            if (deleteProperties.length > 0) this.deleteProperties(deleteProperties, obj);
            dataOrganized.push(obj);
        }
        return dataOrganized;
    }
}
import { Model } from "./Model";

export class PatientModel extends Model {
  private targetDbTable: any = this.prisma.patients;
  public allowedFields: string[] = ['id', 'documentType', 'documentId', 'name', 'lastname', 'cellphone', 'email', 'gender', 'birthday', 'age', 'password', 'department_id', 'insurance_id'];
  public allowedRules: object = {
    'documentType': { type: 'string', max: 25},
    'documentId': { type: 'string', max: 10, min: 8 },
    'name': { type: 'string', max: 50 },
    'lastname': { type: 'string', max: 50 },
    'cellphone': { type: 'string', min: 10 },
    'email': { type: 'string' },
    'gender': { type: 'string', max: 1 },
    'birthday': { type: 'string', max: 10 },
    'age': { type: 'string' },
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

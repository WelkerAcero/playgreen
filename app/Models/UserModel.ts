import { Model } from "./Model";

export class UserModel extends Model {
  private targetDbTable: any = this.prisma.users;
  public allowedFields: string[] = ['id', 'documentType', 'documentId', 'name', 'lastname', 'cellphone', 'email', 'password', 'role_id', 'remember_token'];
  public allowedRules: object = {
    'documentType': { type: 'string', max: 25 },
    'documentId': { type: 'string', min: 8, max: 10 },
    'name': { type: 'string', max: 50 },
    'lastname': { type: 'string', max: 50 },
    'cellphone': { type: 'string', min: 10 },
    'email': { type: 'string' },
    'password': { type: 'string', max: 100, },
    'role_id': { type: 'number' },
    'remember_token': { type: 'string', max: 100 }
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
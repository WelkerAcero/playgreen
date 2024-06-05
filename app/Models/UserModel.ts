import { Model } from "./Model";

export class UserModel extends Model {
  private targetDbTable: any = this.prisma.users;
  public allowedFields: string[] = [
    'id', 'documentId', 'name', 'lastname', 'cellphone', 'email', 'address', 'gender', 'birthDate',
    'city', 'username', 'password', 'role_id', 'country_id', 'remember_token'
  ];

  public allowedRules: object = {
    'documentId': { type: 'string', min: 8, max: 10 },
    'name': { type: 'string', max: 30 },
    'lastname': { type: 'string', max: 30 },
    'cellphone': { type: 'string', min: 12 },
    'email': { type: 'string' },
    'address': { type: 'string', max: 100 },
    'gender': { type: 'string', max: 1 },
    'birthDate': { type: 'string', max: 10 },
    'city': { type: 'string', max: 30 },
    'username': { type: 'string' },
    'password': { type: 'string', max: 100 },
    'role_id': { type: 'number' },
    'country_id': { type: 'number' },
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
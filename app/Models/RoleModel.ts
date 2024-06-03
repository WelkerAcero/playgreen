import { Model } from "./Model";

export class RoleModel extends Model {
  private targetDbTable: any = this.prisma.roles;
  public allowedFields: string[] = ['id', 'rol_name'];
  public allowedRules: object = {'rol_name': { type: 'string', max: 30 },}

  constructor() {
    super();
    this.targetTable();
    this.fieldsAllowed();
  }

  targetTable(): void {
    super.setTargetDbTable(this.targetDbTable);
  }

  fieldsAllowed(): void {
    super.setFields(this.allowedFields);
  }
}

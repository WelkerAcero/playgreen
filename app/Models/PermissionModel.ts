import { Model } from "./Model";

export class PermissionModel extends Model {
  private targetDbTable: any = this.prisma.permissions;
  public allowedFields: string[] = ['id', 'type'];
  public allowedRules: object = {
    'type': { type: 'string', max: 20 },
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

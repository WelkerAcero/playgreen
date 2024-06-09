import { Model } from "./Model";
export class TeamModel extends Model {
  private targetDbTable: any = this.prismaClient.teams;
  private allowedFields: string[] = ['id', 'name'];
  private allowedRules: object = { 'name': { type: "string", max: 50 } };

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

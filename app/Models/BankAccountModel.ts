import { Model } from "./Model";

export class BankAccountModel extends Model {
  private targetDbTable: any = this.prismaClient.bankAccounts;
  private allowedFields: string[] = ['amount', 'account_number', 'user_id'];
  private allowedRules: object = {
    'amount': { type: "string" },
    'account_number': { type: "string", min: 11, max: 11 },
  };

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

import { Model } from "./Model";
export class UsersTransactionModel extends Model {

  private targetDbTable: any = this.prismaClient.usersTransactions;
  private allowedFields: string[] = ['id','amount_money','user_id','category_id', 'bet_id'];
  private allowedRules: object = {
    'amount_money': { type: "string" },
    'user_id': { type: "number" },
    'category_id': { type: "number" },
    'bet_id': { type: "number" },
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

import { Model } from "./Model";

export class BetModel extends Model {
  private targetDbTable: any = this.prismaClient.bets;
  private allowedFields: string[] = ['id', 'bet_option', 'odd', 'status', 'result', 'event_id', 'team_id'];
  private allowedRules: object = {
    'bet_option': { type: "number", },
    'odd': { type: "string" },
    'status': { type: "string"  },
    'result': { type: "string" },
    'event_id': { type: "number" },
    'team_id': { type: "number" },
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

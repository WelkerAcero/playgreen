import { Model } from "./Model";
export class EventModel extends Model {
  private targetDbTable: any = this.prismaClient.events;
  private allowedFields: string[] = ['id', 'name', 'event_place', 'sport_id', 'event_date'];
  private allowedRules: object = {
    'name': { type: "string", max: 50 },
    'event_place': { type: "string", max: 50 },
    'sport_id': { type: "number" },
    'event_date': { type: "object" },
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

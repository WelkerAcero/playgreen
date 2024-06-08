import Decimal from "decimal.js";
import { Request, Response } from "express";
import { BetModel } from "../../Models/BetModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";
import { JWT } from "../../helpers/JWT";
import { BANK_ACCOUNTS_TYPE, BETS_TYPE, COMPLETED_TRANSACTION_TYPE, USERS_TRANSACTIONS_TYPE } from "../../../config/dataStructure/structure";
import { DB } from "../../helpers/DB";

export class BetController extends BetModel {

  getBets = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'BET-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }
      return res.status(200).json(await this.with(['Teams', { Events: { include: { Sports: true } } }]).get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }


  getBet = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'BET-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      return res.status(200).json(await this.where('id', ID).get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  getBetByStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'BET-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const STATUS: string = req.params.status;
      return res.status(200).json(await this.with(['Teams', {
        Events: { include: { Sports: true } },
      }]).where('status', STATUS).get());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  getBetByTeam = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'BET-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const TEAM: string = req.params.team.toString();
      return res.status(200).json(await this.with([
        {
          where: {
            Teams: {
              name: TEAM,
            },
          },
          Teams: true,
          Events: true,
        }
      ]).get());
    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  createNewBet = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'MAKE-BET'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: BETS_TYPE = req.body;
      const STORE = await this.create(DATA);

      if (STORE?.error) return res.status(409).json({ error: { message: STORE.error } });
      return res.status(204).json(STORE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  makeBet = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'MAKE-BET'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      let result: COMPLETED_TRANSACTION_TYPE[] = [];
      const DATA: BANK_ACCOUNTS_TYPE[] = req.body;

      for (let i = 0; i < DATA.length; i++) {
        const ELEMENT = DATA[i];

        /* VALIDACIONES BÁSICAS */
        const DEPOSIT = parseInt(ELEMENT.amount);
        if (DEPOSIT < 0) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.INCORRECT_WITHDRAW_AMOUNT}` } });

        const ACCOUNT = Object.values(await DB.table('BankAccounts').where('account_number', ELEMENT.account_number).where('user_id', ELEMENT.user_id).get<BANK_ACCOUNTS_TYPE>())[0];
        if (!ACCOUNT) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BANK_ACCOUNT_DOESNT_EXIST}, User account: ${ELEMENT.account_number}` } });

        const TO_BET = new Decimal(ELEMENT.amount);
        if (new Decimal(ACCOUNT.amount).lessThan(TO_BET)) {
          return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BANK_INSUFFICIENT_FUNDS}. User Account: ${ELEMENT.account_number}, Bet Option: ${ELEMENT.bet_option}` } });
        }

        // Verificar si la opción de apuesta esta disponible en el cuerpo de la petición
        if (!ELEMENT.bet_option) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BET_OPTION_ERROR}` } });

        const BET_DATA = await this.where('bet_option', ELEMENT.bet_option).get<BETS_TYPE>();
        if (BET_DATA.length < 1) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BET_DOESNT_EXIST}` } });
        if (BET_DATA[0].status !== 'active') return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BET_NOT_VALID_NOW}` } });

        // Conversión y resta
        const CURRENT_BALANCE = new Decimal(ACCOUNT.amount);
        const NEW_AMOUNT = CURRENT_BALANCE.minus(TO_BET);

        /* Dinero que queda en cuenta luego de apostar */
        delete ELEMENT.bet_option; // Delete to store the right properties on BankAccount
        ELEMENT.amount = NEW_AMOUNT.toFixed(4);

        const TRANSACTION: USERS_TRANSACTIONS_TYPE = {
          amount_money: TO_BET.toFixed(4),
          user_id: ELEMENT.user_id,
          category_id: 3,
          bet_id: BET_DATA[0].id
        }

        const STORE = await this.storeAndUpdateTransaction('UsersTransactions', TRANSACTION, 'BankAccounts', ELEMENT, 'account_number');
        if (STORE?.error) return res.status(409).json({ error: { message: `${STORE.error}` } });

        result.push(STORE);
      }

      return res.status(201).json(result);

    } catch (error: any) {
      return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  };


}

import Decimal from 'decimal.js';
import { Request, Response } from "express";
import { BankAccountModel } from "../../Models/BankAccountModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../config/statusMessages/messages";
import { JWT } from "../../helpers/JWT";
import { BANK_ACCOUNTS_TYPE, USERS_TRANSACTIONS_TYPE } from "../../../config/dataStructure/structure";

export class BankAccountController extends BankAccountModel {

  getBankAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'BANK-ACCOUNT-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }
      return res.status(200).json(await this.all());

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  createBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'BANK-ACCOUNT-CREATE'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: BANK_ACCOUNTS_TYPE = req.body;
      const STORE = await this.create(DATA);

      if (STORE?.error) return res.status(409).json({ error: { message: STORE.error } });
      return res.status(204).json(STORE);

    } catch (error) {
      return res.status(500).json(ERROR_MESSAGES.CLIENT_SERVER_ERROR);
    }
  }

  depositMoney = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'MAKE-DEPOSIT'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: BANK_ACCOUNTS_TYPE = req.body;
      const DEPOSIT = parseInt(DATA.amount);
      if (DEPOSIT < 0) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.INCORRECT_DEPOSIT_AMOUNT}` } });

      const ACCOUNT = Object.values(await this.where('account_number', DATA.account_number).where('user_id', DATA.user_id).get<BANK_ACCOUNTS_TYPE>())[0];
      if (!ACCOUNT) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BANK_ACCOUNT_DOESNT_EXIST}` } });

      // Conversión y sumatorias
      const CURRENT_BALANCE = new Decimal(ACCOUNT.amount);
      const TO_DEPOSIT = new Decimal(DATA.amount);
      const NEW_AMOUNT = CURRENT_BALANCE.plus(TO_DEPOSIT);
      DATA.amount = NEW_AMOUNT.toFixed(4);

      const TRANSACTION: USERS_TRANSACTIONS_TYPE = {
        amount_money: TO_DEPOSIT.toFixed(4),
        user_id: DATA.user_id,
        category_id: 2
      }

      console.log("DATA:", DATA);
      const STORE = await this.storeAndUpdateTransaction('UsersTransactions', TRANSACTION, 'BankAccounts', DATA, 'account_number');
      if (STORE?.error) return res.status(409).json({ error: { message: `${STORE.error}` } });
      return res.status(201).json(STORE);

    } catch (error: any) {
      return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  withdrawMoney = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'MAKE-WITHDRAW'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const DATA: BANK_ACCOUNTS_TYPE = req.body;

      /* VALIDACIONES BÁSICAS */
      const DEPOSIT = parseInt(DATA.amount);
      if (DEPOSIT < 0) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.INCORRECT_WITHDRAW_AMOUNT}` } });

      const ACCOUNT = Object.values(await this.where('account_number', DATA.account_number).where('user_id', DATA.user_id).get<BANK_ACCOUNTS_TYPE>())[0];
      if (!ACCOUNT) return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BANK_ACCOUNT_DOESNT_EXIST}` } });

      const TO_WITHDRAW = new Decimal(DATA.amount);
      if (new Decimal(ACCOUNT.amount).lessThan(TO_WITHDRAW)) {
        return res.status(409).json({ error: { message: `${ERROR_MESSAGES.BANK_INSUFFICIENT_FUNDS}` } });
      }

      // Conversión y resta
      const CURRENT_BALANCE = new Decimal(ACCOUNT.amount);
      const NEW_AMOUNT = CURRENT_BALANCE.minus(TO_WITHDRAW);
      DATA.amount = NEW_AMOUNT.toFixed(4);

      const TRANSACTION: USERS_TRANSACTIONS_TYPE = {
        amount_money: TO_WITHDRAW.toFixed(4),
        user_id: DATA.user_id,
        category_id: 1
      }

      const STORE = await this.storeAndUpdateTransaction('UsersTransactions', TRANSACTION, 'BankAccounts', DATA, 'account_number');
      if (STORE?.error) return res.status(409).json({ error: { message: `${STORE.error}` } });
      return res.status(201).json(STORE);

    } catch (error: any) {
      return res.json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  };

}

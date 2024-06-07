import { Router } from "express";
import { BankAccountController } from "../../app/Http/Controllers/BankAccountController";

const CONTROLLER = new BankAccountController();
const router = Router();

router.post("/bank-account/list", CONTROLLER.getBankAccounts);
router.post("/bank-account/create", CONTROLLER.createBankAccount);
router.post("/bank-account/deposit", CONTROLLER.depositMoney);
router.post("/bank-account/withdraw", CONTROLLER.withdrawMoney);

export default router;

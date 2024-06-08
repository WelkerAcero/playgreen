import { Router } from "express";
import { BetController } from "../../app/Http/Controllers/BetController";

const CONTROLLER = new BetController();
const router = Router();

router.get("/bet/all", CONTROLLER.getBets);
router.get("/bet/:id", CONTROLLER.getBet);
router.post("/bet/create", CONTROLLER.createNewBet);
router.post("/bet/make-bet", CONTROLLER.makeBet);

export default router;

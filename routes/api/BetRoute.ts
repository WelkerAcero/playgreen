import { Router } from "express";
import { BetController } from "../../app/Http/Controllers/BetController";

const CONTROLLER = new BetController();
const router = Router();

router.get("/bet/get/all", CONTROLLER.getBets);
router.get("/bet/get/:id", CONTROLLER.getBet);
router.get("/bet/get/status/:status", CONTROLLER.getBetByStatus);
router.get("/bet/get/team/:team", CONTROLLER.getBetByTeam);

router.post("/bet/create", CONTROLLER.createNewBet);
router.post("/bet/make-bet", CONTROLLER.makeBet);

export default router;

import { Router } from "express";
import { SportController } from "../../app/Http/Controllers/SportController";

const CONTROLLER = new SportController();
const router = Router();

router.get("/sports/get/all", CONTROLLER.getSports);
router.get("/sport/get/:id", CONTROLLER.getSport);
router.post("/sport/create", CONTROLLER.storeSport);
router.put("/sport/update/:id", CONTROLLER.updateSport);
router.delete("/sport/delete/:id", CONTROLLER.deleteSport);

export default router;

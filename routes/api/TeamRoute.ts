import { Router } from "express";
import { TeamController } from "../../app/Http/Controllers/TeamController";

const CONTROLLER = new TeamController();
const router = Router();

router.get("/team/get/all", CONTROLLER.getTeams);
router.get("/team/get/:id", CONTROLLER.getTeam);
router.post("/team/create", CONTROLLER.storeTeam);
router.put("/team/update/:id", CONTROLLER.updateTeam);
router.delete("/team/delete/:id", CONTROLLER.deleteTeam);

export default router;

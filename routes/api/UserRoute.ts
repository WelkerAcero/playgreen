import { Router } from "express";
import { UserController } from "../../app/Http/Controllers/UserController";

const CONTROLLER = new UserController();
const router = Router();

router.get("/user/get/all", CONTROLLER.getUsers);
router.put("/user/update/profile", CONTROLLER.updateProfile);
router.put("/user/update/password/:id", CONTROLLER.updatePasswordProfile);

export default router;

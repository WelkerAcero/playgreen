import { Router } from "express";
import { UserController } from "../../app/Http/Controllers/UserController";

const CONTROLLER = new UserController();
const router = Router();

router.get("/users-list", CONTROLLER.getUsers);
router.delete("/user/:id", CONTROLLER.deleteUser);
router.get("/user-roles", CONTROLLER.getUserRoles);

export default router;

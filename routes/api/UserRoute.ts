import { Router } from "express";
import { UserController } from "../../app/Http/Controllers/UserController";

const CONTROLLER = new UserController();
const router = Router();

router.get("/users-list", CONTROLLER.getUsers);
router.delete("/user/:id", CONTROLLER.deleteUser);
//router.get("/user-roles", CONTROLLER.getUserRoles);

// router.get("/example", CONTROLLER.get1);
// router.get("/example/:id", CONTROLLER.get2);
// router.post("/example", CONTROLLER.store);
// router.put("/example/:id", CONTROLLER.update);
// router.delete("/example/:id", CONTROLLER.delete);

export default router;

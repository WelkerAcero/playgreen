import { Router } from "express";
import { UserController } from "../../app/Http/Controllers/UserController";

const CONTROLLER = new UserController();
const router = Router();

router.get("/admin/users-list", CONTROLLER.getUsers);
router.put("/user-edit-profile/:id", CONTROLLER.updateProfile);
router.put("/user-edit-password/:id", CONTROLLER.updatePasswordProfile);


//router.delete("/user-delete/:id", CONTROLLER.deleteUser);
//router.get("/user-roles", CONTROLLER.getUserRoles);
// router.get("/example", CONTROLLER.get1);
// router.get("/example/:id", CONTROLLER.get2);
// router.post("/example", CONTROLLER.store);
// router.put("/example/:id", CONTROLLER.update);
// router.delete("/example/:id", CONTROLLER.delete);

export default router;

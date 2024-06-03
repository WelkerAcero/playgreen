import { Router } from "express";
import { RoleController } from "../../app/Http/Controllers/RoleController";

const CONTROLLER = new RoleController();
const router = Router();

router.get("/roles/", CONTROLLER.getRoles);
router.post("/role", CONTROLLER.storeRoleAndPermissions);
router.get("/role/:id", CONTROLLER.getRole);
router.put("/role/:id", CONTROLLER.updateRoleAndPermissions);
router.delete("/role/:id", CONTROLLER.deleteRole);

export default router;

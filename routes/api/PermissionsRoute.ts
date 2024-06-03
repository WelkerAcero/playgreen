import { Router } from "express";
import { PermissionController } from "../../app/Http/Controllers/PermissionController";
const CONTROLLER = new PermissionController();
const router = Router();

router.get("/permissions", CONTROLLER.getPermissions);

export default router;

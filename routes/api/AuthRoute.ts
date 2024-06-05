import { Router } from "express";
import { AuthController } from "../../app/Http/Controllers/AuthController";

const CONTROLLER = new AuthController();
const router = Router();

router.post("/auth/register-user-non-credentials", CONTROLLER.registerNonCredentials);
router.post("/auth/admin-register", CONTROLLER.registerAdmin);
router.post("/auth/login", CONTROLLER.authenticateAdmin);
router.post("/auth/verify-recovery-token", CONTROLLER.verifyRecoveryToken);
router.post("/auth/recovery-credentials", CONTROLLER.newRecoveryCredentials);
router.put("/auth/recover-password", CONTROLLER.sendEmailToken);

export default router;

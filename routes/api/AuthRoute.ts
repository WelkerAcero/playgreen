import { Router } from "express";
import { AuthController } from "../../app/Http/Controllers/AuthController";

const CONTROLLER = new AuthController();
const router = Router();

router.post("/admin-register", CONTROLLER.registerAdmin);
router.post("/login", CONTROLLER.authenticateAdmin);
router.post("/verify-recovery-token", CONTROLLER.verifyRecoveryToken);
router.post("/recovery-credentials", CONTROLLER.newRecoveryCredentials);

router.put("/recover-password", CONTROLLER.sendEmailToken);
router.put("/edit-profile/:id", CONTROLLER.updateProfile);
router.put("/edit-password/:id", CONTROLLER.updatePasswordProfile);

export default router;

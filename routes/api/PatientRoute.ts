import { Router } from "express";
import { PatientController } from "../../app/Http/Controllers/PatientController";

const CONTROLLER = new PatientController();
const router = Router();

// router.get("/patients", CONTROLLER.getPatients);
// router.get("/patient/:id", CONTROLLER.getPatient);
// router.post("/patients", CONTROLLER.storePatient);
// router.put("/patient/:id", CONTROLLER.updatePatient);
// router.delete("/patient/:id", CONTROLLER.deletePatient);

export default router;

import { Router } from "express";
import { EventController } from "../../app/Http/Controllers/EventController";

const CONTROLLER = new EventController();
const router = Router();

router.get("/event/get/all", CONTROLLER.getEvents);
router.get("/event/get/:id", CONTROLLER.getEvent);
router.post("/event/create", CONTROLLER.storeEvent);
router.put("/event/update/:id", CONTROLLER.updateEvent);
router.delete("/event/delete/:id", CONTROLLER.deleteEvent);

export default router;

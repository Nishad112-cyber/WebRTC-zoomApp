import { Router } from "express";
import { login , Register} from "../controllers/user.controller.js";


const router = Router();

router.route("/").get((req, res) => {
    res.send("Users API working ");
});

router.route("/login").post(login);

router.route("/register").post(Register);
router.route("/add_to_activity").post((req, res) => {
    res.send("Activity added");
});
router.route("/add_all_activity").get((req, res) => {
    res.send("All activities");
});

export default router;

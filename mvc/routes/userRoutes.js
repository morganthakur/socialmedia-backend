import express from "express";
import {
    changeUserPassword,
    getAllUsers,
    getUserById,
    loggedInUser,
    resetUserPassword,
    sendUserEmail,
    userRegister,
    userlogin,
} from '../controller/userController.js';
import { checkUserAuth } from "../../middlewares/auth.js";

const router = express.Router();



// applying router level auth middlewares here 


router.use("/change/password", checkUserAuth);
router.use("/logged/user", checkUserAuth);




router.post("/login", userlogin);
router.post("/register", userRegister);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/reset/email", sendUserEmail);
router.post("/reset/password/:id/:token", resetUserPassword);
router.post("/change/password", changeUserPassword);
router.get("/logged/user", loggedInUser);

export default router;

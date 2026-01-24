const { Router } = require("express");
const userController = require("../Controllers/userController");

const router = Router();

// users.routes.js
router.post("/create", userController.createUser);
router.get("/get/:idUser", userController.getUserById);
router.get("/getAll", userController.getAllUsers);
router.put("/update/:idUser", userController.updateUser);
router.delete("/delete/:idUser", userController.deleteUser);
router.get("/byRole/:roleUser", userController.getUsersByRole);


module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../../../../controllers/userControllers');

router.get("/all", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserById/:id", userController.getUserById);
router.put("/updateUser/:id", userController.updateUser);

module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../../../../controllers/userControllers");
const passport = require("../../../../config/passport");

router.get("/all", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserById/:id", userController.getUserById);
router.put("/updateUser/:id", userController.updateUser);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // On success, send user info (or JWT, or redirect)
    res.json({ message: "Google sign-in successful", user: req.user });
  }
);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
module.exports = router;

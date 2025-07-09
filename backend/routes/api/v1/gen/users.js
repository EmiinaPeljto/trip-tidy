const express = require("express");
const router = express.Router();
const userController = require("../../../../controllers/userControllers");
const passport = require("../../../../config/passport");
const authenticateToken = require("../../../../middleware/auth");
const jwt = require("jsonwebtoken"); 

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
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "168h" }
    );
    // Redirect to frontend with token as query param
    const redirectUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173/"
    }?token=${token}`;
    res.redirect(redirectUrl);
  }
);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get("/me", authenticateToken, userController.getMe);
module.exports = router;

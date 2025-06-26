const express = require("express");
const router = express.Router();
const emailVerificationsController = require("../../../../controllers/emailVerificatinController");

router.post("/verify-email", emailVerificationsController.verifyEmailCode);
router.post("/resend-verification-code", emailVerificationsController.resendVerificationCode);

module.exports = router;

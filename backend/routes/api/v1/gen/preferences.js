const express = require("express");
const preferenceController = require("../../../../controllers/preferenceController.js");

const router = express.Router();

router.get("/getPreferences", preferenceController.getPreferences);

module.exports = router;
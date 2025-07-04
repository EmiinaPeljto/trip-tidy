const preferenceModel = require("../models/preferenceModel");

exports.getPreferences = async (req, res) => {
    try {
        const preferences = await preferenceModel.getPreferences();
        res.json(preferences);
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).json({ error: "Failed to fetch preferences" });
    }
};

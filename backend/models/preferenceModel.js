const db = require("../config/db");

exports.getPreferences = async () => {
    const [rows] = await db.query("SELECT * FROM preferences");
    return rows;
};

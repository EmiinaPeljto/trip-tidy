const summaryService = require("../services/summaryService");

exports.getSummary = async (req, res) => {
  try {
    const parsedContent = await summaryService.generateSummary(req.body);
    res.status(200).json(parsedContent);
  } catch (error) {
    console.error("Error generating summary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
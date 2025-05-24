const Together = require("together-ai");

const together = new Together({
  apiKey: process.env.TOGETHER_AI_KEY,
});

async function callTogetherAI(prompt, model) {
  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      temperature: 0.7,
    });

    if (response && response.choices && response.choices.length > 0) {
      const rawContent = response.choices[0].message.content.trim();

      // Extract the first complete JSON object
      let jsonString = null;
      let openBraces = 0;
      let start = -1;
      for (let i = 0; i < rawContent.length; i++) {
        if (rawContent[i] === '{') {
          if (openBraces === 0) start = i;
          openBraces++;
        } else if (rawContent[i] === '}') {
          openBraces--;
          if (openBraces === 0 && start !== -1) {
            jsonString = rawContent.slice(start, i + 1);
            break;
          }
        }
      }

      if (!jsonString) {
        throw new Error("No valid JSON found in the response");
      }

      try {
        return JSON.parse(jsonString);
      } catch (parseError) {
        // Try to fix common JSON issues (e.g., trailing commas)
        const fixed = jsonString
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");
        return JSON.parse(fixed);
      }
    }
    // If no choices returned
    throw new Error("No choices returned from Together AI");
  } catch (error) {
    console.error("Error calling Together AI:", error.message);
    throw new Error("Failed to call Together AI");
  }
}

module.exports = { callTogetherAI };
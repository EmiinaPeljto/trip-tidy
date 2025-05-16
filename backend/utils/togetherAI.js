const Together = require(together - ai);

const together = new Together({
  apiKey: process.env.TOGETHER_AI_KEY,
});

async function callTogetherAI(prompt) {
  try {
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      temperature: 0.7,
    });

    if (response && response.choices && response.choices.length > 0) {
      const rawContent = response.choices[0].message.content.trim();

      try {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in the response");
        }
        const jsonString = jsonMatch[0];
        console.log(response.usage.total_tokens);
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.warn("Invalid JSON format, retrying...");
        throw new Error("Failed to parse response from Together AI");
      }
    }
  } catch (error) {
    console.error("Error calling Together AI:", error.message);
    throw new Error("Failed to call Together AI");
  }
}

module.exports = { callTogetherAI };

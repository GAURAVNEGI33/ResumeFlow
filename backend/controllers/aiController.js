async function improveText(req, res) {
  try {
    const { text } = req.body;
    // TODO: Integrate OpenAI or Gemini API here
    const improvedText = `[AI Improved] ${text}`;
    res.send({ success: true, improvedText });
  } catch (error) {
    console.log("error in AI improve:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
}

module.exports = { improveText };

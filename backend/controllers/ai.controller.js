import { generateContent } from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;
    const result = await generateContent(prompt);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

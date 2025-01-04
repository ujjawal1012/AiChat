import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCdEmGtbm-xoUxGdLNOn2QcIZb1xqE4pPM");
console.log("🚀 ~ genAI:", genAI)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt) => {
  const result = await model.generateContent(prompt);
    return result.response.text();
};

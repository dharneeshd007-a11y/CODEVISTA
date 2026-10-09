import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export const isAiConfigured = () => !!ai;

export async function summarizeText(text) {
  if (!ai) return null;
  const prompt = `Please analyze the following document and extract key insights.

Document Text:
${text}

Return ONLY a JSON object with this exact structure (use empty arrays if no relevant data is found):
{
  "summary": "Short paragraph summary of the document.",
  "importantDates": [
    { "date": "15 Oct 2026", "desc": "Event description" }
  ],
  "requirements": [
    "Requirement 1", "Requirement 2"
  ],
  "actionItems": [
    { "title": "Action to take", "priority": "High or Medium or Low" }
  ],
  "importantDetails": [
    "Important detail 1", "Important detail 2"
  ],
  "reviewItems": [
    { "label": "Review item 1", "type": "High Attention or Important or Needs Verification" }
  ],
  "relatedSources": []
}
Do not include markdown code blocks, just raw JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
  });
  
  try {
    let text = response.text.trim();
    if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
    return text; // Return the JSON string, the server will store it as a string
  } catch (e) {
    console.error("Failed to parse JSON from AI:", e);
    return null;
  }
}

export async function askQuestion(question, documentsText) {
  if (!ai) return null;
  const prompt = `You are a helpful assistant. Answer the user's question using ONLY the provided document context. If the answer is not in the documents, state that clearly. Cite document names where possible. Do not invent answers.

Context Documents:
${documentsText}

User Question: ${question}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
  });
  
  return response.text;
}

export async function compareDocuments(docA, docB) {
  if (!ai) return null;
  const prompt = `Compare these two documents and identify similarities, differences, and conflicts. Focus on Dates, Deadlines, Budgets, Requirements, Quantities, and Important statements.

Document A (${docA.name}):
${docA.content}

Document B (${docB.name}):
${docB.content}

Return ONLY a JSON object with this exact structure:
{
  "summary": "Short summary of the comparison",
  "matchCount": 1,
  "conflictCount": 1,
  "conflicts": [
    { "title": "Conflict Title", "description": "Details", "valA": "Value from A", "valB": "Value from B" }
  ],
  "tableItems": [
    { "field": "Deadline", "valA": "...", "valB": "...", "status": "Conflict or Match" }
  ]
}
Do not include markdown code blocks, just raw JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
  });
  
  try {
    let text = response.text.trim();
    if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from AI:", e);
    return null;
  }
}

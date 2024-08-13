import axios from "axios";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config()

interface Severity {
  level: string;
  description: string;
  recomendation: string;
}

export interface AuditResponse {
  score: string;
  severity: Severity[];
}

console.log("process.env.OPENAI_API_KEY",process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
  baseURL: "https://api.openai.com/v1",
});

const prompt = `You are an AI that provides audit responses in below pure json format without extra information. Give audit score percentage out of 100 and give potential issues on the basis of severity in a list. Please return the data in the following structure only without any newline character and no data can be empty and null:
{
  "score": "",
  "severity": [
    {
      "level": "",
      "description": "",
      "recomendation": ""
    }
  ]
}
`;

export const getAuditResponse = async (contract: string | null): Promise<AuditResponse | null> => {
  try {
    if (!contract) {
      return null;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Update the model as needed
      messages: [{ role: "user", content: prompt + contract }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    let responseContent = "";

    for await (const chunk of completion) {
      responseContent += chunk.choices[0]?.delta?.content || "";
    }

    const auditResponse: AuditResponse = JSON.parse(responseContent) as AuditResponse;

    return auditResponse;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return null;
  }
}
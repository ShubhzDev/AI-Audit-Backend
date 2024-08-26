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
  high:string,
  medium:string,
  low:string,
  severity: Severity[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the environment variables
  baseURL: "https://api.openai.com/v1",
});

const prompt = `You are an AI that provides audit responses in below pure json format without extra infromation.Give audit score percetange out of 100 and give potential issue on basis of severity in list.Please return the data in the following structure only without any newline character and no data can be empty and null:
High,Medium and Low severity tells total number of relevant bugs you listed.

{
  "score": "",
  "high": "",
  "medium": "",
  "low": "",
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
// console.log(auditResponse);
    return auditResponse;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return null;
  }
}
import axios from "axios";
import OpenAI from "openai";

interface Severity {
  level: string;
  description: string;
  recomendation: string;
}

export interface AuditResponse {
  score: string;
  severity: Severity[];
}

const openai = new OpenAI({
  apiKey: process.env.nndia_api, // Ensure your API key is set in the environment variables
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const prompt = `Give audit score out of 10 and give potential issue on basis of severity in list.You are an AI that provides audit responses in below pure json format.Please return the data in the following structure only without any newline character:
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

export const getAuditResponse = async(contract: string): Promise<AuditResponse | null> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
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

    const auditResponse : AuditResponse = JSON.parse(
      responseContent
    ) as AuditResponse;

    console.log("AuditResponse Response : ", auditResponse);

    return auditResponse;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return null;
  }
}

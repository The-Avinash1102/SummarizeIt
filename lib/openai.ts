import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: `Transform this document into an engaging-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1500,  
        });

        return response.choices[0].message.content;

    } catch (error: any) {
        console.error('Error while generating summary:', error);

        if (error?.status === 429) {
            throw new Error('RATE_LIMIT_EXCEEDED');
        }

        if (error?.message?.includes('API request error')) {
            throw new Error('OPENAI_API_REQUEST_ERROR');
        }

        throw error;
    }
}
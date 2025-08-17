'use server';
/**
 * @fileOverview A flow for analyzing and answering questions about a chat conversation.
 * It can either summarize the chat or answer a specific question based on the user's query.
 *
 * - analyzeChat - A function that handles the chat analysis.
 * - AnalyzeChatInput - The input type for the analyzeChat function.
 * - AnalyzeChatOutput - The return type for the analyzeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { kpiData, journeyData, restrictions, memberPersona, teamRoles, topics } from '@/lib/data';
import { monthlyJourney } from '@/lib/monthwise-data';


const AnalyzeChatInputSchema = z.object({
  chatHistory: z.string().describe('The entire chat history conversation.'),
  query: z
    .string()
    .describe('The user\'s query (e.g., "Summarize this" or a specific question).'),
});
export type AnalyzeChatInput = z.infer<typeof AnalyzeChatInputSchema>;

const AnalyzeChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the query.'),
});
export type AnalyzeChatOutput = z.infer<typeof AnalyzeChatOutputSchema>;

export async function analyzeChat(
  input: AnalyzeChatInput
): Promise<AnalyzeChatOutput> {
  return analyzeChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChatPrompt',
  input: {schema: AnalyzeChatInputSchema},
  output: {schema: AnalyzeChatOutputSchema},
  prompt: `You are an AI assistant that analyzes chat conversations.
Your task is to respond to the user's query based on the provided chat history and the extensive background data.
When answering, you MUST use the provided data to explain the "why" (the rationale) behind the events in the conversation.

## Source Data for Analysis

### 1. Generated Chat History:
This is the simulated conversation you need to analyze.
---
{{{chatHistory}}}
---

### 2. Member and Program Information:
- **Member Persona:** ${memberPersona}
- **Team Roles:** ${teamRoles}
- **Topics:** ${topics}
- **Key Metrics:** ${JSON.stringify(kpiData)}
- **8-Month Health Pillar Data:** ${JSON.stringify(journeyData)}

### 3. Detailed Interaction Log (The "Why"):
This log contains the specific events, decisions, and the rationale behind them. Use this as the primary source for explaining the reasons for actions.
---
${restrictions}
---

### 4. Month-wise Journey Summary:
This provides a higher-level summary of goals, friction points, and outcomes for each month.
---
${monthlyJourney}
---

## User Query

"{{{query}}}"

## Your Task

Based on the user's query, the chat history, and all the provided source data, provide a helpful and comprehensive response.

- If the query asks for a summary (e.g., "summarize this", "give me the gist"), provide a concise summary of the entire conversation, incorporating key decisions and outcomes from the source data.
- If the query is a specific question, answer it by synthesizing information from the chat history and the detailed source data. Crucially, you must explain the **reasoning or rationale** for the events or decisions mentioned.
- If the answer to a specific question cannot be found in the provided data, state that you cannot answer based on the information you have.
`,
});

const analyzeChatFlow = ai.defineFlow(
  {
    name: 'analyzeChatFlow',
    inputSchema: AnalyzeChatInputSchema,
    outputSchema: AnalyzeChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

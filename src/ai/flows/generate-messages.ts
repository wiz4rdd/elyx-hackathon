'use server';
/**
 * @fileOverview Generates role-specific messages for Elyx team members based on their roles and the member persona, incorporating constraints such as testing frequency and travel.
 *
 * - generateMessages - A function that generates the messages.
 * - GenerateMessagesInput - The input type for the generateMessages function.
 * - GenerateMessagesOutput - The return type for the generateMessages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMessagesInputSchema = z.object({
  memberPersona: z
    .string()
    .describe('The persona details of the member (Rohan Patel).'),
  teamRoles: z
    .string()
    .describe(
      'The roles of the Elyx team members (Ruby, Dr. Warren, Advik, Carla, Rachel, and Neel) and their communication styles.'
    ),
  topics: z
    .string()
    .describe(
      'The topics to be covered in the messages, including general queries, blood markers, plan updates, and weekly reports.'
    ),
  restrictions: z
    .string()
    .describe(
      'The restrictions to be incorporated into the conversations, such as testing frequency, travel, and plan adherence.'
    ),
   kpiData: z.string().describe("Key Performance Indicators over the 8-month journey."),
   journeyData: z.string().describe("The 8-month health journey data, showing pillar scores over time."),
});
export type GenerateMessagesInput = z.infer<typeof GenerateMessagesInputSchema>;

const GenerateMessagesOutputSchema = z.object({
  messages: z
    .string()
    .describe(
      'The generated communication messages between the member and the Elyx team members.'
    ),
});
export type GenerateMessagesOutput = z.infer<typeof GenerateMessagesOutputSchema>;

export async function generateMessages(input: GenerateMessagesInput): Promise<GenerateMessagesOutput> {
  return generateMessagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMessagesPrompt',
  input: {schema: GenerateMessagesInputSchema},
  output: {schema: GenerateMessagesOutputSchema},
  prompt: `You are an AI assistant specializing in generating realistic communication messages between a member (Rohan Patel) and the Elyx team members.

You will use the provided member persona, team roles, communication topics, and restrictions to generate the messages. Ensure the messages are role-specific and incorporate the given constraints, such as testing frequency and travel.

Also consider the following data which represents the member's 8-month journey. The conversation should reflect these data points and trends.

Member Persona: {{{memberPersona}}}
Team Roles: {{{teamRoles}}}
Topics: {{{topics}}}
Restrictions: {{{restrictions}}}
Key Metrics: {{{kpiData}}}
8-Month Health Pillar Data: {{{journeyData}}}


Generate the communication messages:
`,
});

const generateMessagesFlow = ai.defineFlow(
  {
    name: 'generateMessagesFlow',
    inputSchema: GenerateMessagesInputSchema,
    outputSchema: GenerateMessagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

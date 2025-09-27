
'use server';
/**
 * @fileOverview AI-powered detailed sub-step suggestion flow.
 *
 * - suggestDetailedSteps - A function that suggests detailed, concise steps for a given task.
 * - SuggestDetailedStepsInput - The input type for the suggestDetailedSteps function.
 * - SuggestDetailedStepsOutput - The return type for the suggestDetailedSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDetailedStepsInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task.'),
  taskDescription: z.string().describe('The description of the task.'),
});
export type SuggestDetailedStepsInput = z.infer<typeof SuggestDetailedStepsInputSchema>;

const SuggestDetailedStepsOutputSchema = z.object({
  detailedSteps: z.array(z.string()).describe('An array of detailed, concise sub-steps for the given task.'),
});
export type SuggestDetailedStepsOutput = z.infer<typeof SuggestDetailedStepsOutputSchema>;

export async function suggestDetailedSteps(input: SuggestDetailedStepsInput): Promise<SuggestDetailedStepsOutput> {
  return suggestDetailedStepsFlow(input);
}

const suggestDetailedStepsPrompt = ai.definePrompt({
  name: 'suggestDetailedStepsPrompt',
  input: {schema: SuggestDetailedStepsInputSchema},
  output: {schema: SuggestDetailedStepsOutputSchema},
  prompt: `You are a helpful task breakdown assistant. Given a task title and description, generate 3 to 5 detailed, actionable sub-steps to help the user complete the main task. Each step should be very concise, ideally 3-7 words, but clear enough to guide action. Focus on breaking the task into smaller, manageable actions.

Task Title: {{{taskTitle}}}
Task Description: {{{taskDescription}}}

Detailed Steps:`,
});

const suggestDetailedStepsFlow = ai.defineFlow(
  {
    name: 'suggestDetailedStepsFlow',
    inputSchema: SuggestDetailedStepsInputSchema,
    outputSchema: SuggestDetailedStepsOutputSchema,
  },
  async input => {
    const {output} = await suggestDetailedStepsPrompt(input);
    return output!;
  }
);

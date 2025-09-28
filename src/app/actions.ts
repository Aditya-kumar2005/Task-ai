'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// --- Schemas for AI Flows ---

const SuggestionInputSchema = z.object({
  taskDescription: z.string().min(1, "Task description cannot be empty."),
});

const DetailedStepsInputSchema = z.object({
  taskTitle: z.string().min(1, "Task title cannot be empty."),
  taskDescription: z.string().min(1, "Task description cannot be empty."),
});

const SuggestSubtasksOutputSchema = z.object({
  subtasks: z.array(z.string()).describe('An array of 2-4 suggested subtasks for the given task.'),
});

const SuggestDetailedStepsOutputSchema = z.object({
  detailedSteps: z.array(z.string()).describe('An array of 3 to 5 detailed, concise, actionable sub-steps for the given task. Each step should be 3-7 words.'),
});

// --- Genkit Flow for Subtask Suggestions ---

export type SuggestSubtasksInput = z.infer<typeof SuggestionInputSchema>;
export type SuggestSubtasksOutput = z.infer<typeof SuggestSubtasksOutputSchema>;

const suggestSubtasksPrompt = ai.definePrompt({
  name: 'suggestSubtasksPrompt',
  input: { schema: SuggestionInputSchema },
  output: { schema: SuggestSubtasksOutputSchema },
  prompt: `You are a helpful task management assistant. Given a task description, suggest three subtasks that would help the user break down the task into smaller, manageable steps.

Task Description: {{{taskDescription}}}
`,
});

const suggestSubtasksFlow = ai.defineFlow(
  {
    name: 'suggestSubtasksFlow',
    inputSchema: SuggestionInputSchema,
    outputSchema: SuggestSubtasksOutputSchema,
  },
  async (input) => {
    const { output } = await suggestSubtasksPrompt(input);
    return output!;
  }
);

export async function getAISubtaskSuggestions(input: SuggestSubtasksInput): Promise<SuggestSubtasksOutput | { error: string }> {
  try {
    const result = await suggestSubtasksFlow(input);
    return result;
  } catch (error) {
    console.error("Error fetching AI subtask suggestions:", error);
    return { error: "Failed to fetch AI suggestions. Please try again." };
  }
}

// --- Genkit Flow for Detailed Steps ---

export type SuggestDetailedStepsInput = z.infer<typeof DetailedStepsInputSchema>;
export type SuggestDetailedStepsOutput = z.infer<typeof SuggestDetailedStepsOutputSchema>;

const suggestDetailedStepsPrompt = ai.definePrompt({
  name: 'suggestDetailedStepsPrompt',
  input: { schema: DetailedStepsInputSchema },
  output: { schema: SuggestDetailedStepsOutputSchema },
  prompt: `You are a helpful task breakdown assistant. Your goal is to generate 3 to 5 detailed, actionable sub-steps for a given task. Each step must be very concise (3-7 words) and clear.

EXAMPLE:
Task Title: Plan a birthday party
Task Description: Organize a birthday party for a friend next month. Need to handle invitations, venue, and cake.

Your Output:
{
  "detailedSteps": [
    "Finalize guest list and budget",
    "Research and book a venue",
    "Send out digital invitations",
    "Order a custom birthday cake",
    "Plan party day activities"
  ]
}

TASK TO PROCESS:
Task Title: {{{taskTitle}}}
Task Description: {{{taskDescription}}}

Your Output:
`,
});

const suggestDetailedStepsFlow = ai.defineFlow(
  {
    name: 'suggestDetailedStepsFlow',
    inputSchema: DetailedStepsInputSchema,
    outputSchema: SuggestDetailedStepsOutputSchema,
  },
  async (input) => {
    const { output } = await suggestDetailedStepsPrompt(input);
    return output!;
  }
);

export async function getAIDetailedSteps(input: SuggestDetailedStepsInput): Promise<SuggestDetailedStepsOutput | { error: string }> {
  try {
    const result = await suggestDetailedStepsFlow(input);
    return result;
  } catch (error) {
    console.error("Error fetching AI detailed steps:", error);
    return { error: "Failed to fetch AI detailed steps. Please try again." };
  }
}


// --- Schemas for Auth (Placeholders) ---

const SignupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type SignupInput = z.infer<typeof SignupInputSchema>;

const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

// Placeholder Authentication Actions
// In a real application, these would interact with your authentication backend (e.g., Firebase Auth, custom DB).

export async function handleSignup(
  input: SignupInput
): Promise<{ success: boolean; error?: string; userId?: string }> {
  const validationResult = SignupInputSchema.safeParse(input);
  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  // --- !!! THIS IS MOCK LOGIC !!! ---
  console.log('Attempting signup for:', input.email);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return { success: true, userId: `mock_user_${Date.now()}` };
  // --- END MOCK LOGIC ---
}

interface MockUser {
  id: string;
  email: string;
}

export async function handleLogin(
  input: LoginInput
): Promise<{ success: boolean; error?: string; user?: MockUser }> {
  const validationResult = LoginInputSchema.safeParse(input);
  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  // --- !!! THIS IS MOCK LOGIC !!! ---
  console.log('Attempting login for:', input.email);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  if (input.email && input.password) {
    return { 
      success: true, 
      user: { 
        id: `mock_user_${Date.now()}`, 
        email: input.email 
      } 
    };
  }

  return { success: false, error: "Invalid credentials (mock error)." };
  // --- END MOCK LOGIC ---
}

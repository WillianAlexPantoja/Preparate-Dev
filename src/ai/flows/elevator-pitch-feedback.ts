// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing feedback on elevator pitches.
 *
 * The flow takes an elevator pitch as input and returns AI-powered feedback on its clarity and persuasiveness.
 * This helps junior developers refine their self-introduction for potential employers.
 *
 * @exports {
 *   analyzeElevatorPitch: (input: ElevatorPitchInput) => Promise<ElevatorPitchOutput>;
 *   ElevatorPitchInput: z.infer<typeof ElevatorPitchInputSchema>;
 *   ElevatorPitchOutput: z.infer<typeof ElevatorPitchOutputSchema>;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ElevatorPitchInputSchema = z.object({
  pitch: z.string().describe('The elevator pitch to analyze.'),
});
export type ElevatorPitchInput = z.infer<typeof ElevatorPitchInputSchema>;

const ElevatorPitchOutputSchema = z.object({
  clarityScore: z
    .number()
    .describe('A score from 1-10 indicating the clarity of the pitch.'),
  persuasivenessScore: z
    .number()
    .describe('A score from 1-10 indicating the persuasiveness of the pitch.'),
  feedback: z.string().describe('Detailed feedback on how to improve the pitch.'),
});
export type ElevatorPitchOutput = z.infer<typeof ElevatorPitchOutputSchema>;

const elevatorPitchFeedbackPrompt = ai.definePrompt({
  name: 'elevatorPitchFeedbackPrompt',
  input: {schema: ElevatorPitchInputSchema},
  output: {schema: ElevatorPitchOutputSchema},
  prompt: `You are an expert career coach providing feedback on elevator pitches.

  Analyze the following elevator pitch and provide feedback on its clarity and persuasiveness.
  Provide a clarity score (1-10), a persuasiveness score (1-10), and detailed feedback on how to improve the pitch.

  Elevator Pitch: {{{pitch}}}

  Your Feedback (clarity score, persuasiveness score, and detailed feedback):`,
});

const analyzeElevatorPitchFlow = ai.defineFlow(
  {
    name: 'analyzeElevatorPitchFlow',
    inputSchema: ElevatorPitchInputSchema,
    outputSchema: ElevatorPitchOutputSchema,
  },
  async input => {
    const {output} = await elevatorPitchFeedbackPrompt(input);
    return output!;
  }
);

export async function analyzeElevatorPitch(
  input: ElevatorPitchInput
): Promise<ElevatorPitchOutput> {
  return analyzeElevatorPitchFlow(input);
}

// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides AI-driven feedback and performance evaluation for code solutions.
 *
 * - aiCodeReview - A function that handles the code review process.
 * - AiCodeReviewInput - The input type for the aiCodeReview function.
 * - AiCodeReviewOutput - The return type for the aiCodeReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AiCodeReviewInputSchema = z.object({
  code: z.string().describe('The code solution to be reviewed.'),
  challengeDescription: z.string().describe('The description of the coding challenge.'),
  programmingLanguage: z.string().describe('The programming language of the code solution.'),
});
export type AiCodeReviewInput = z.infer<typeof AiCodeReviewInputSchema>;

const PerformanceEvaluationSchema = z.enum(['Excellent', 'Good', 'Fair', 'Poor']);

const AiCodeReviewOutputSchema = z.object({
  feedback: z.string().describe('AI-driven feedback on the code solution.'),
  performanceEvaluation: PerformanceEvaluationSchema.describe('Evaluation of the code solution performance level.'),
});
export type AiCodeReviewOutput = z.infer<typeof AiCodeReviewOutputSchema>;

export async function aiCodeReview(input: AiCodeReviewInput): Promise<AiCodeReviewOutput> {
  return aiCodeReviewFlow(input);
}

const evaluateCodePerformance = ai.defineTool({
  name: 'evaluateCodePerformance',
  description: 'Evaluates the performance level of a given code solution.',
  inputSchema: z.object({
    code: z.string().describe('The code solution to evaluate.'),
    challengeDescription: z.string().describe('The description of the coding challenge.'),
    programmingLanguage: z.string().describe('The programming language of the code solution.'),
  }),
  outputSchema: PerformanceEvaluationSchema,
}, async (input) => {
  // Placeholder implementation for code performance evaluation.
  // In a real application, this would involve running the code against test cases
  // and analyzing its efficiency.
  // For now, return a default value.
  return 'Fair';
});

const prompt = ai.definePrompt({
  name: 'aiCodeReviewPrompt',
  input: {schema: AiCodeReviewInputSchema},
  output: {schema: AiCodeReviewOutputSchema},
  tools: [evaluateCodePerformance],
  prompt: `You are an AI code reviewer that provides feedback to junior developers on their code solutions.

  Challenge Description: {{{challengeDescription}}}

  Programming Language: {{{programmingLanguage}}}

  Code Solution:
  \`\`\`{{{programmingLanguage}}}
  {{{code}}}
  \`\`\`

  Evaluate the code solution and provide constructive feedback. Also, use the evaluateCodePerformance tool to evaluate the performance level of the code.
  `,
});

const aiCodeReviewFlow = ai.defineFlow(
  {
    name: 'aiCodeReviewFlow',
    inputSchema: AiCodeReviewInputSchema,
    outputSchema: AiCodeReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

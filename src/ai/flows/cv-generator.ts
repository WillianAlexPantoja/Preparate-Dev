'use server';
/**
 * @fileOverview Provides AI-driven CV generation and feedback.
 *
 * - generateCv - A function that handles the CV generation process.
 * - CvInput - The input type for the generateCv function.
 * - CvOutput - The return type for the generateCv function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CvInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  summary: z.string().describe('The professional summary of the user.'),
  experience: z.string().describe("A description of the user's work experience."),
  education: z.string().describe("A description of the user's education."),
  skills: z.string().describe("A comma-separated list of the user's skills."),
});
export type CvInput = z.infer<typeof CvInputSchema>;

const CvOutputSchema = z.object({
  cvContent: z.string().describe('The generated CV content in Markdown format. Use headings for sections like "Experiencia", "Educación", and "Habilidades".'),
  feedback: z.string().describe('Constructive feedback on the provided information to help the user improve their CV.'),
});
export type CvOutput = z.infer<typeof CvOutputSchema>;

export async function generateCv(input: CvInput): Promise<CvOutput> {
  return cvGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cvGeneratorPrompt',
  input: {schema: CvInputSchema},
  output: {schema: CvOutputSchema},
  prompt: `
You are an expert career coach and professional resume writer specializing in helping junior developers land their first job.
Your task is to generate a professional CV in Spanish based on the user's information and provide feedback for improvement.

**User Information:**
- **Full Name:** {{{fullName}}}
- **Email:** {{{email}}}
- **Professional Summary:** {{{summary}}}
- **Work Experience:** {{{experience}}}
- **Education:** {{{education}}}
- **Skills:** {{{skills}}}

**Instructions:**
1.  **Generate CV Content:** Create a clean, professional, and well-structured CV in Markdown format.
    - Start with the full name and email.
    - Include the professional summary.
    - Create clear sections for "Experiencia Laboral", "Educación", and "Habilidades".
    - For the skills, format them as a bulleted list.
    - Ensure the tone is professional and tailored for a tech industry role.

2.  **Provide Feedback:** Analyze the user's input and provide concise, actionable feedback.
    - Comment on the strength of the professional summary.
    - Suggest improvements for describing experience and education.
    - Mention if any key information seems to be missing.
    - The feedback should be encouraging and helpful.
  `,
});

const cvGeneratorFlow = ai.defineFlow(
  {
    name: 'cvGeneratorFlow',
    inputSchema: CvInputSchema,
    outputSchema: CvOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

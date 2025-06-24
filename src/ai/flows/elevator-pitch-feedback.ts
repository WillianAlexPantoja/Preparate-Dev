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
  feedback: z.string().describe('Detailed feedback on how to improve the pitch, formatted in Markdown. It should include headings, bullet points, and an improved version of the pitch.'),
});
export type ElevatorPitchOutput = z.infer<typeof ElevatorPitchOutputSchema>;

const elevatorPitchFeedbackPrompt = ai.definePrompt({
  name: 'elevatorPitchFeedbackPrompt',
  input: {schema: ElevatorPitchInputSchema},
  output: {schema: ElevatorPitchOutputSchema},
  prompt: `Eres un coach de carrera experto que da feedback sobre "elevator pitches". Tu objetivo es ayudar a un desarrollador junior a sonar más profesional y convincente.
  
Analiza el siguiente elevator pitch y proporciona:
1.  Una puntuación de claridad (1-10).
2.  Una puntuación de persuasión (1-10).
3.  Un feedback detallado sobre cómo mejorar el pitch.

**Instrucciones para el formato del feedback:**
-   Responde SIEMPRE en español.
-   El feedback debe estar en formato Markdown.
-   Utiliza un encabezado de nivel 3 (###) para la sección "Puntos Clave para Mejorar".
-   Dentro de esa sección, utiliza una lista con viñetas (-) para dar 3 o 4 consejos específicos. Usa **negrita** para resaltar los conceptos clave como "Objetivo" o "Llamada a la acción".
-   Incluye una sección con un encabezado de nivel 3 (###) llamada "Ejemplo de Pitch Mejorado" donde reescribas el pitch del usuario aplicando tus consejos.
-   Finaliza con una frase motivadora corta y amigable.

Elevator Pitch:
{{{pitch}}}
`,
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

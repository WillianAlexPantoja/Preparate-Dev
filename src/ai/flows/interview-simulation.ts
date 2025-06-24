'use server';
/**
 * @fileOverview Provides AI-driven interview simulation and feedback.
 *
 * - conductInterview: A function to conduct a conversational interview.
 * - evaluateInterview: A function to evaluate the interview and provide feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for a single message in the conversation history
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

// Input for the main interview flow
const ConductInterviewInputSchema = z.object({
  topic: z.string().describe('The topic for the interview questions (e.g., React, JavaScript, Behavioral).'),
  history: z.array(MessageSchema).describe('The history of the conversation so far.'),
});
export type ConductInterviewInput = z.infer<typeof ConductInterviewInputSchema>;

// Output of the main interview flow
const ConductInterviewOutputSchema = z.object({
  response: z.string().describe('The next question or statement from the AI interviewer.'),
  isFinished: z.boolean().describe('A boolean indicating if the interview has concluded.'),
});
export type ConductInterviewOutput = z.infer<typeof ConductInterviewOutputSchema>;

// The main conversational flow
const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: ConductInterviewInputSchema,
    outputSchema: ConductInterviewOutputSchema,
  },
  async ({ topic, history }) => {
    const interviewLength = 4; // Total number of questions
    const userMessages = history.filter(m => m.role === 'user').length;

    if (userMessages >= interviewLength) {
      return {
        response: 'Gracias por tus respuestas. La entrevista ha concluido. Ahora generaré tu feedback. Por favor, espera un momento...',
        isFinished: true,
      };
    }

    const prompt = `
      Eres un entrevistador técnico amigable y profesional llamado Alex. Tu objetivo es realizar una breve entrevista de práctica a un desarrollador junior.

      **Tema de la Entrevista:** ${topic}

      **Instrucciones:**
      1.  Mantén un tono conversacional y alentador.
      2.  Realiza UNA SOLA PREGUNTA a la vez. No hagas listas de preguntas.
      3.  La primera pregunta debe ser una pregunta de introducción relacionada con el tema.
      4.  Basa tus preguntas siguientes en las respuestas del usuario y el historial de la conversación, manteniendo el tema.
      5.  Haz preguntas que evalúen tanto el conocimiento técnico como la capacidad de razonamiento.
      6.  NO termines la entrevista. El sistema lo hará automáticamente después de ${interviewLength} preguntas.

      **Historial de la Conversación:**
      ${history.map(m => `${m.role === 'user' ? 'Candidato' : 'Entrevistador'}: ${m.content}`).join('\n')}

      **Tu Próxima Pregunta:**`;

    const llmResponse = await ai.generate({
        prompt: prompt,
        history: history.map(m => ({ role: m.role, parts: [{ text: m.content }]})),
    });

    return {
      response: llmResponse.text,
      isFinished: false,
    };
  }
);
export async function conductInterview(input: ConductInterviewInput): Promise<ConductInterviewOutput> {
    return conductInterviewFlow(input);
}


// Input for the evaluation flow
const EvaluateInterviewInputSchema = z.object({
    topic: z.string(),
    history: z.array(MessageSchema).describe('The complete transcript of the interview.'),
});
export type EvaluateInterviewInput = z.infer<typeof EvaluateInterviewInputSchema>;

// Output for the evaluation flow
const EvaluateInterviewOutputSchema = z.object({
  overallScore: z.number().min(1).max(10).describe('An overall score for the interview performance, from 1 to 10.'),
  summary: z.string().describe('A brief summary of the interview performance.'),
  strengths: z.string().describe('Positive feedback and strengths observed during the interview, formatted in Markdown.'),
  areasForImprovement: z.string().describe('Constructive feedback on areas to improve, formatted in Markdown.'),
});
export type EvaluateInterviewOutput = z.infer<typeof EvaluateInterviewOutputSchema>;

// The evaluation flow
const evaluateInterviewFlow = ai.defineFlow(
    {
        name: 'evaluateInterviewFlow',
        inputSchema: EvaluateInterviewInputSchema,
        outputSchema: EvaluateInterviewOutputSchema,
    },
    async ({ topic, history }) => {
        const prompt = ai.definePrompt({
            name: 'evaluateInterviewPrompt',
            input: { schema: EvaluateInterviewInputSchema },
            output: { schema: EvaluateInterviewOutputSchema },
            prompt: `
            Eres un coach de carrera experto analizando la transcripción de una entrevista de práctica. El candidato es un desarrollador junior.

            **Tema de la Entrevista:** {{{topic}}}

            **Transcripción de la Entrevista:**
            {{#each history}}
            - **{{#if (eq role "user")}}Candidato{{else}}Entrevistador{{/if}}:** {{{content}}}
            {{/each}}

            **Instrucciones de Evaluación:**
            1.  Proporciona una **puntuación general** (de 1 a 10) que refleje el desempeño del candidato.
            2.  Escribe un **resumen conciso** de la actuación.
            3.  Identifica 2-3 **puntos fuertes** clave. Usa formato Markdown con viñetas.
            4.  Identifica 2-3 **áreas de mejora** claras y accionables. Sé constructivo. Usa formato Markdown con viñetas.
            5.  Sé objetivo y justo, considerando que es un perfil junior.
            `
        });

        const { output } = await prompt({ topic, history });
        return output!;
    }
);
export async function evaluateInterview(input: EvaluateInterviewInput): Promise<EvaluateInterviewOutput> {
    return evaluateInterviewFlow(input);
}

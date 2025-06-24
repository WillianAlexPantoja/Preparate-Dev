'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { aiCodeReview, AiCodeReviewOutput } from '@/ai/flows/ai-code-review';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, ShieldCheck, FileCode } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type FormState = {
  data: AiCodeReviewOutput | null;
  error: string | null;
}

const initialState: FormState = {
  data: null,
  error: null,
};

const codeChallenges = [
    { id: '1', name: 'Invertir una cadena', description: 'Escribe una función que invierta una cadena de texto.' },
    { id: '2', name: 'Encontrar el número mayor', description: 'Escribe una función que encuentre el número más grande en un array.' },
    { id: '3', name: 'FizzBuzz', description: 'Escribe una función que imprima números del 1 al 100, pero para múltiplos de 3 imprima "Fizz", para múltiplos de 5 "Buzz", y para múltiplos de ambos "FizzBuzz".' },
];

const languages = ['JavaScript', 'Python', 'Java'];

function PerformanceBadge({ evaluation }: { evaluation: AiCodeReviewOutput['performanceEvaluation'] }) {
    const variants: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
        Excellent: 'default',
        Good: 'secondary',
        Fair: 'outline',
        Poor: 'destructive'
    };
    const variant = variants[evaluation] || 'outline';
    return <Badge variant={variant} className="capitalize">{evaluation.toLowerCase()}</Badge>
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
            <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Evaluando...
            </>
        ) : (
            'Evaluar mi Solución'
        )}
        </Button>
    );
}

function ResultsDisplay({ data }: { data: AiCodeReviewOutput | null }) {
    const { pending } = useFormStatus();

    if (pending) {
        return (
            <Card className="h-full sticky top-8">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div>
                        <Skeleton className="h-6 w-1/2 mb-2 rounded-md" />
                        <Skeleton className="h-6 w-1/4 rounded-full" />
                    </div>
                    <div>
                        <Skeleton className="h-6 w-1/2 mb-2 rounded-md" />
                        <Skeleton className="h-4 w-full mt-2 rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-5/6 rounded-md" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Resultados de la Revisión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold flex items-center gap-2"><ShieldCheck /> Evaluación de Rendimiento</h4>
                        <PerformanceBadge evaluation={data.performanceEvaluation} />
                    </div>
                    <div>
                        <h4 className="font-semibold flex items-center gap-2"><Lightbulb /> Feedback del AI</h4>
                        <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{data.feedback}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="h-full sticky top-8">
             <CardHeader>
                <CardTitle>Esperando tu solución...</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-12">
                <p>Completa el desafío, escribe tu código y haz clic en "Evaluar mi Solución" para recibir feedback instantáneo.</p>
             </CardContent>
        </Card>
    );
}

export default function InterviewPrepPage() {
    const [selectedChallenge, setSelectedChallenge] = useState(codeChallenges[0]);
    
    const submitAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
        const code = formData.get('code') as string;
        const programmingLanguage = formData.get('language') as string;
        
        if (!code || code.trim().length < 10) {
            return { data: null, error: 'Por favor, introduce una solución de código válida.' };
        }
        if (!programmingLanguage) {
            return { data: null, error: 'Por favor, selecciona un lenguaje de programación.' };
        }

        try {
            const result = await aiCodeReview({ 
                code,
                programmingLanguage,
                challengeDescription: selectedChallenge.description
            });
            return { data: result, error: null };
        } catch (e) {
            return { data: null, error: 'Ha ocurrido un error al revisar tu código. Inténtalo de nuevo.' };
        }
    };

    const [state, formAction] = useActionState(submitAction, initialState);

    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Zona de Simulación de Entrevista</h1>
                <p className="text-muted-foreground">Pon a prueba tus habilidades con desafíos técnicos y recibe feedback de nuestra IA.</p>
            </header>

            <form action={formAction} className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileCode /> Desafío Técnico</CardTitle>
                            <div className="flex flex-wrap gap-4 items-center pt-2">
                                <Select onValueChange={(value) => setSelectedChallenge(codeChallenges.find(c => c.id === value) || codeChallenges[0])} defaultValue={selectedChallenge.id}>
                                    <SelectTrigger className="w-full md:w-[280px]">
                                        <SelectValue placeholder="Elige un desafío" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {codeChallenges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select name="language" defaultValue={languages[0]}>
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <SelectValue placeholder="Elige un lenguaje" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <CardDescription className="pt-4">{selectedChallenge.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                name="code"
                                placeholder={`// Escribe tu solución aquí`}
                                rows={15}
                                className="font-code text-sm"
                            />
                        </CardContent>
                    </Card>
                    
                    <SubmitButton />
                    {state.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <ResultsDisplay data={state.data} />
                </div>
            </form>
        </div>
    );
}

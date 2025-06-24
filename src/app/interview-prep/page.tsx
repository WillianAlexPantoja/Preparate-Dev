'use client';

import { useState, useActionState } from 'react';
import { aiCodeReview, AiCodeReviewOutput } from '@/ai/flows/ai-code-review';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, ShieldCheck, FileCode } from "lucide-react";
import { Badge } from '@/components/ui/badge';

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

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <form action={formAction} className="lg:col-span-2 space-y-6">
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
                    
                    <Button type="submit" size="lg" className="w-full">
                        Evaluar mi Solución
                    </Button>
                    {state.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
                </form>

                <div className="lg:col-span-1 space-y-6">
                    {state.data ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Resultados de la Revisión</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2"><ShieldCheck /> Evaluación de Rendimiento</h4>
                                    <PerformanceBadge evaluation={state.data.performanceEvaluation} />
                                </div>
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2"><Lightbulb /> Feedback del AI</h4>
                                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{state.data.feedback}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full sticky top-8">
                             <CardHeader>
                                <CardTitle>Esperando tu solución...</CardTitle>
                             </CardHeader>
                             <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-12">
                                <p>Completa el desafío, escribe tu código y haz clic en "Evaluar mi Solución" para recibir feedback instantáneo.</p>
                             </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

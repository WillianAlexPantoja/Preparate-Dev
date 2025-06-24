'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  conductInterview,
  evaluateInterview,
  EvaluateInterviewOutput,
  Message,
} from '@/ai/flows/interview-simulation';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, User, BrainCircuit, Star, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


const interviewTopics = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React & Next.js' },
    { value: 'Behavioral', label: 'Preguntas Conductuales (STAR)' },
    { value: 'Data Structures', label: 'Estructuras de Datos' },
];

function InterviewerIcon() {
    return (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Bot size={20} />
        </div>
    )
}

function UserIcon() {
    return (
        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
            <User size={20} />
        </div>
    )
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="default" disabled={pending || disabled}>
        {pending ? (
            <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
            </>
        ) : (
            <>
            Enviar Respuesta <ArrowRight/>
            </>
        )}
        </Button>
    );
}

function FeedbackSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full rounded-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function InterviewPrepPage() {
    const [topic, setTopic] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<EvaluateInterviewOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const startNewInterview = async () => {
        if (!topic) {
            setError('Por favor, selecciona un tema para comenzar.');
            return;
        }
        setError(null);
        setMessages([]);
        setFeedback(null);
        setIsFinished(false);
        setIsLoading(true);
        setIsInterviewing(true);

        try {
            const result = await conductInterview({ topic, history: [] });
            setMessages([{ role: 'model', content: result.response }]);
        } catch (e) {
            setError('Hubo un error al iniciar la entrevista. Inténtalo de nuevo.');
            setIsInterviewing(false);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setTopic('');
        setMessages([]);
        setIsInterviewing(false);
        setIsFinished(false);
        setFeedback(null);
        setError(null);
    }

    const handleSubmitAnswer = async (formData: FormData) => {
        const userAnswer = formData.get('answer') as string;
        if (!userAnswer.trim()) return;

        const newHistory: Message[] = [...messages, { role: 'user', content: userAnswer }];
        setMessages(newHistory);
        setIsLoading(true);
        
        try {
            const result = await conductInterview({ topic, history: newHistory });
            setMessages(prev => [...prev, { role: 'model', content: result.response }]);

            if (result.isFinished) {
                setIsFinished(true);
                const evaluation = await evaluateInterview({ topic, history: [...newHistory, { role: 'model', content: result.response }]});
                setFeedback(evaluation);
            }
        } catch (e) {
             setError('Hubo un error al procesar tu respuesta. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInterviewing) {
        return (
            <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-[calc(100vh-10rem)]">
                <header className="max-w-xl">
                    <BrainCircuit className="w-20 h-20 mx-auto text-primary" />
                    <h1 className="text-3xl font-bold mt-4">Simulador de Entrevistas con IA</h1>
                    <p className="text-muted-foreground mt-2">
                        Elige un tema y practica tus respuestas con nuestro entrevistador virtual. Recibe feedback valioso para clavar tu próxima entrevista real.
                    </p>
                </header>
                <Card className="mt-8 w-full max-w-md">
                    <CardContent className="pt-6 space-y-4">
                        <Select onValueChange={setTopic} value={topic}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tema..." />
                            </SelectTrigger>
                            <SelectContent>
                                {interviewTopics.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button onClick={startNewInterview} size="lg" className="w-full">
                            Comenzar Simulación
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 h-[calc(100vh-7rem)] flex flex-col">
            <header className="mb-4 flex justify-between items-center">
                <div>
                     <h1 className="text-2xl font-bold">Simulación en Curso</h1>
                     <p className="text-muted-foreground flex items-center gap-2">Tema: <Badge variant="secondary">{interviewTopics.find(t => t.value === topic)?.label}</Badge></p>
                </div>
                <Button variant="outline" onClick={handleReset}>Reiniciar</Button>
            </header>
            
            <div className="grid lg:grid-cols-3 gap-8 items-start flex-grow min-h-0">
                <div className="lg:col-span-2 h-full flex flex-col border rounded-lg">
                    <div ref={chatContainerRef} className="flex-grow p-4 space-y-6 overflow-y-auto">
                        {messages.map((msg, index) => (
                             <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' && "justify-end")}>
                                {msg.role === 'model' && <InterviewerIcon />}
                                <div className={cn("max-w-xl p-3 rounded-lg", msg.role === 'model' ? "bg-muted" : "bg-primary text-primary-foreground")}>
                                     <article className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    </article>
                                </div>
                                 {msg.role === 'user' && <UserIcon />}
                            </div>
                        ))}
                         {isLoading && messages[messages.length-1]?.role === 'user' && (
                             <div className="flex items-start gap-4">
                                <InterviewerIcon />
                                <div className="max-w-xl p-3 rounded-lg bg-muted">
                                    <div className="animate-pulse flex space-x-2">
                                        <div className="rounded-full bg-slate-700 h-2 w-2"></div>
                                        <div className="rounded-full bg-slate-700 h-2 w-2"></div>
                                        <div className="rounded-full bg-slate-700 h-2 w-2"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form action={handleSubmitAnswer} className="p-4 border-t bg-background">
                         <div className="relative">
                            <Textarea
                                name="answer"
                                placeholder={isFinished ? "La entrevista ha terminado." : "Escribe tu respuesta..."}
                                rows={3}
                                className="pr-40"
                                disabled={isFinished || isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!isLoading && !isFinished) {
                                            (e.currentTarget.form as HTMLFormElement).requestSubmit();
                                        }
                                    }
                                }}
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                                <SubmitButton disabled={isFinished || isLoading} />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1 space-y-6 sticky top-8">
                     {isFinished && (isLoading && !feedback) && <FeedbackSkeleton />}
                     {feedback && (
                        <Card>
                             <CardHeader>
                                <CardTitle>Resultados de la Simulación</CardTitle>
                                <CardDescription>{feedback.summary}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <h4 className="font-semibold flex items-center gap-2"><Star /> Puntuación General</h4>
                                      <p className="font-bold text-lg text-primary">{feedback.overallScore}/10</p>
                                    </div>
                                    <Progress value={feedback.overallScore * 10} />
                                </div>
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2 text-green-600"><ThumbsUp/> Puntos Fuertes</h4>
                                     <article className="prose prose-sm dark:prose-invert max-w-none mt-2 text-muted-foreground">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback.strengths}</ReactMarkdown>
                                     </article>
                                </div>
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2 text-amber-600"><ThumbsDown/> Áreas de Mejora</h4>
                                     <article className="prose prose-sm dark:prose-invert max-w-none mt-2 text-muted-foreground">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback.areasForImprovement}</ReactMarkdown>
                                     </article>
                                </div>
                            </CardContent>
                        </Card>
                     )}
                     {!isFinished && (
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>¡Concentración!</CardTitle>
                                <CardDescription>El feedback aparecerá aquí al finalizar.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-12">
                                <p>Lee cada pregunta con atención y tómate tu tiempo para formular la mejor respuesta posible.</p>
                            </CardContent>
                        </Card>
                     )}
                </div>
            </div>
        </div>
    );
}

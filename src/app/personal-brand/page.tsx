'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeElevatorPitch, ElevatorPitchOutput } from '@/ai/flows/elevator-pitch-feedback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, BarChart, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type FormState = {
  data: ElevatorPitchOutput | null;
  error: string | null;
}

const initialState: FormState = {
  data: null,
  error: null,
};

function AnalyzeButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analizando...
        </>
      ) : (
        'Analizar mi Pitch'
      )}
    </Button>
  );
}

function FeedbackDisplay({ data }: { data: ElevatorPitchOutput | null }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-4 w-1/3 mb-2 rounded-md" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/3 mb-2 rounded-md" />
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          </div>
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <Skeleton className="h-6 w-1/3 rounded-md" />
            <Skeleton className="h-4 w-full mt-4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Feedback Personalizado de la IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium flex items-center gap-2"><BarChart /> Claridad</p>
              <p className="font-bold text-lg text-primary">{data.clarityScore}/10</p>
            </div>
            <Progress value={data.clarityScore * 10} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium flex items-center gap-2"><Star /> Persuasión</p>
              <p className="font-bold text-lg text-accent">{data.persuasivenessScore}/10</p>
            </div>
            <Progress value={data.persuasivenessScore * 10} className="[&>div]:bg-accent" />
          </div>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
           <article className="prose prose-sm dark:prose-invert max-w-none">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.feedback}</ReactMarkdown>
           </article>
        </div>
      </CardContent>
    </Card>
  )
}

function ElevatorPitchSimulator() {
    const [pitch, setPitch] = useState('');
    const [state, formAction] = useActionState(
      async (prevState: FormState, formData: FormData): Promise<FormState> => {
        const pitchText = formData.get('pitch') as string;
        if (!pitchText || pitchText.length < 20) {
          return { data: null, error: 'Por favor, introduce un pitch de al menos 20 caracteres.' };
        }
        try {
          const result = await analyzeElevatorPitch({ pitch: pitchText });
          return { data: result, error: null };
        } catch (e) {
          return { data: null, error: 'Ha ocurrido un error al analizar tu pitch. Inténtalo de nuevo.' };
        }
      },
      initialState
    );
  
    return (
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Simulador de Elevator Pitch</CardTitle>
            <CardDescription>Escribe tu pitch y recibe feedback instantáneo de nuestra IA para mejorar tu presentación.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="pitch"
              placeholder="Ej: Soy un desarrollador frontend apasionado por crear interfaces de usuario intuitivas y accesibles. Tengo experiencia con React y Next.js, y estoy buscando mi primera oportunidad para aportar valor a un equipo dinámico."
              rows={5}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              required
              minLength={20}
            />
             {state.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
          </CardContent>
          <CardFooter className='justify-end'>
             <AnalyzeButton />
          </CardFooter>
        </Card>
        <FeedbackDisplay data={state.data} />
      </form>
    );
  }

const quizQuestions = [
  {
    question: 'Un reclutador te pregunta: "¿Cuál es tu mayor debilidad?". ¿Qué respondes?',
    answers: [
      { text: '"Soy demasiado perfeccionista."', isCorrect: false, feedback: 'Aunque común, esta respuesta puede sonar a cliché y poco sincera. Es mejor ser honesto sobre una debilidad real y mostrar cómo estás trabajando en ella.' },
      { text: '"A veces me cuesta pedir ayuda y trato de resolverlo todo por mi cuenta, pero estoy aprendiendo a ser más colaborativo."', isCorrect: true, feedback: '¡Excelente! Esta respuesta muestra autoconciencia, honestidad y un enfoque proactivo para mejorar. Convierte una debilidad en una fortaleza de crecimiento.' },
      { text: '"No tengo ninguna debilidad."', isCorrect: false, feedback: 'Esta respuesta puede parecer arrogante y falta de autoconciencia. Todo el mundo tiene áreas de mejora.' },
      { text: '"Me desorganizo con facilidad."', isCorrect: false, feedback: 'Mencionar una debilidad sin explicar cómo la estás manejando puede ser una señal de alerta para el reclutador.' },
    ],
  },
  {
    question: 'En la entrevista te preguntan sobre una tecnología del listado de requisitos que no conoces. ¿Qué haces?',
    answers: [
      { text: 'Pretendo que la conozco y espero que no pregunten más.', isCorrect: false, feedback: 'Ser deshonesto es un gran riesgo. Si te descubren, tu credibilidad quedará arruinada. Es mejor ser transparente.' },
      { text: 'Digo "No la conozco", y nada más.', isCorrect: false, feedback: 'Si bien es honesto, es una respuesta pasiva. Pierdes la oportunidad de demostrar tu interés y capacidad de aprendizaje.' },
      { text: '"No he trabajado con ella, pero he investigado y entiendo que sirve para [X]. Me entusiasma aprenderla y aprendo rápido."', isCorrect: true, feedback: '¡Perfecto! Demuestras honestidad, proactividad, interés en el puesto y confianza en tu capacidad para aprender.' },
      { text: 'Cambio de tema rápidamente.', isCorrect: false, feedback: 'Ser evasivo genera desconfianza. Es mejor abordar la pregunta directamente con honestidad y una actitud positiva.' },
    ],
  },
  {
    question: '¿Qué tipo de pregunta es mejor hacer al final de la entrevista al reclutador?',
    answers: [
        { text: '"¿Cuáles son los próximos pasos en el proceso?"', isCorrect: false, feedback: 'Es una pregunta válida, pero muy estándar. No te diferencia de otros candidatos. Guárdala para el final si aún no te lo han dicho.' },
        { text: '"¿Qué es lo que más te gusta de trabajar aquí?"', isCorrect: false, feedback: 'Es una buena pregunta para crear conexión, pero no demuestra tanto interés en el rol o el equipo como otras opciones.' },
        { text: '"¿Cuáles son los mayores desafíos que enfrenta el equipo actualmente y cómo podría yo contribuir a solucionarlos?"', isCorrect: true, feedback: '¡Esta es una pregunta excelente! Demuestra que piensas estratégicamente, estás ansioso por aportar valor y quieres entender a fondo los retos del equipo.' },
        { text: '"¿Cuánto paga el puesto?"', isCorrect: false, feedback: 'Evita preguntar sobre el salario en la primera entrevista a menos que el reclutador saque el tema. Puede dar la impresión de que solo te interesa el dinero.' },
    ]
  }
];

function RecruiterQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<{ index: number; isCorrect: boolean; feedback: string } | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerClick = (answer: typeof currentQuestion.answers[0], index: number) => {
    if (selectedAnswer) return;

    setSelectedAnswer({ index, isCorrect: answer.isCorrect, feedback: answer.feedback });
    if (answer.isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };
  
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }

  if (quizFinished) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>¡Quiz Completado!</CardTitle>
          <CardDescription>Has respondido todas las preguntas.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-2xl font-bold">Tu puntuación: {score} de {quizQuestions.length}</p>
          <p className="text-muted-foreground">¡Sigue practicando para perfeccionar tus habilidades de entrevista!</p>
          <Button onClick={handleResetQuiz}>
            Intentar de Nuevo
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz: ¿Qué dirías si...?</CardTitle>
        <CardDescription>Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-lg mb-6">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswer?.index === index;
            const variant = isSelected ? (answer.isCorrect ? 'default' : 'destructive') : 'outline';
            return (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer, index)}
                className="w-full justify-start h-auto text-wrap"
                variant={variant}
                disabled={!!selectedAnswer}
              >
                { isSelected && (answer.isCorrect ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />) }
                {answer.text}
              </Button>
            );
          })}
        </div>
        {selectedAnswer && (
          <Alert className={cn("mt-6", selectedAnswer.isCorrect ? "border-green-500 text-green-700" : "border-red-500 text-red-700")}>
            <AlertTitle className="flex items-center gap-2">
              {selectedAnswer.isCorrect ? <CheckCircle/> : <XCircle/>}
              {selectedAnswer.isCorrect ? '¡Correcto!' : 'Intenta otra vez'}
            </AlertTitle>
            <AlertDescription className="text-primary">
              {selectedAnswer.feedback}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {selectedAnswer && (
         <CardFooter className="justify-end">
            <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < quizQuestions.length - 1 ? "Siguiente Pregunta" : "Finalizar Quiz"}
                <ArrowRight className="ml-2"/>
            </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default function PersonalBrandPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Marca Personal / Cómo Venderte</h1>
        <p className="text-muted-foreground">Aprende a comunicar tu valor y a interactuar con confianza.</p>
      </header>
       <Tabs defaultValue="pitch-simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pitch-simulator">Elevator Pitch</TabsTrigger>
          <TabsTrigger value="recruiter-qa">Quiz para Reclutadores</TabsTrigger>
        </TabsList>

        <TabsContent value="pitch-simulator" className="mt-6">
            <ElevatorPitchSimulator />
        </TabsContent>

        <TabsContent value="recruiter-qa" className="mt-6">
           <RecruiterQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
}

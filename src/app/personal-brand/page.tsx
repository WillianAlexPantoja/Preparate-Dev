'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { analyzeElevatorPitch, ElevatorPitchOutput } from '@/ai/flows/elevator-pitch-feedback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Star, BarChart } from "lucide-react";
import { Progress } from '@/components/ui/progress';


type FormState = {
  data: ElevatorPitchOutput | null;
  error: string | null;
}

const initialState: FormState = {
  data: null,
  error: null,
};


function FeedbackDisplay({ data }: { data: ElevatorPitchOutput | null }) {
  if (!data) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Tu Feedback</CardTitle>
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
        <div>
          <h4 className="font-semibold flex items-center gap-2"><Lightbulb /> Puntos de mejora</h4>
          <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{data.feedback}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ElevatorPitchSimulator() {
    const [pitch, setPitch] = useState('');
    const [state, formAction] = useFormState(
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
          <CardContent className="space-y-4">
            <Textarea
              name="pitch"
              placeholder="Ej: Soy un desarrollador frontend apasionado por crear interfaces de usuario intuitivas y accesibles. Tengo experiencia con React y Next.js, y estoy buscando mi primera oportunidad para aportar valor a un equipo dinámico."
              rows={5}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              required
              minLength={20}
            />
            <Button type="submit" className="w-full">
              Analizar mi Pitch
            </Button>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          </CardContent>
        </Card>
        {<FeedbackDisplay data={state.data} />}
      </form>
    );
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
           <Card>
            <CardHeader>
              <CardTitle>Quiz: ¿Qué harías si te preguntan esto?</CardTitle>
              <CardDescription>Prepárate para las preguntas difíciles de los reclutadores. (Funcionalidad en desarrollo)</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground p-12">
              <p>El quiz interactivo estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

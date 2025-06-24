'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateCv, CvOutput } from '@/ai/flows/cv-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Lightbulb, FileText } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

type FormState = {
  data: CvOutput | null;
  error: string | null;
  message: string | null;
}

const initialState: FormState = {
  data: null,
  error: null,
  message: null
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generando...
        </>
      ) : (
        'Generar CV'
      )}
    </Button>
  );
}

function CvResults({ state }: { state: FormState }) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <br />
            <Skeleton className="h-6 w-1/3 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.data) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> CV Generado</CardTitle>
            <CardDescription>Esta es una vista previa de tu CV. Puedes copiar el contenido.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 border rounded-lg bg-muted/50">
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {state.data.cvContent}
              </ReactMarkdown>
            </article>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb /> Feedback de la IA</CardTitle>
            <CardDescription>Sugerencias para hacer tu CV aún más impactante.</CardDescription>
          </CardHeader>
          <CardContent>
            <article className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {state.data.feedback}
              </ReactMarkdown>
            </article>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card className="h-full sticky top-8">
      <CardHeader>
        <CardTitle>Esperando tu información...</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-12">
        <p>Completa el formulario y haz clic en "Generar CV" para recibir una versión creada por IA y feedback para mejorarla.</p>
      </CardContent>
    </Card>
  );
}


function CvGeneratorTab() {
  const submitAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
      const cvData = {
          fullName: formData.get('fullName') as string,
          email: formData.get('email') as string,
          summary: formData.get('summary') as string,
          experience: formData.get('experience') as string,
          education: formData.get('education') as string,
          skills: formData.get('skills') as string,
      };

      if (!cvData.fullName || !cvData.email || !cvData.summary) {
          return { ...initialState, error: 'Por favor, completa los campos de nombre, email y resumen.' };
      }

      try {
          const result = await generateCv(cvData);
          return { data: result, error: null, message: '¡Tu CV ha sido generado!' };
      } catch (e) {
          return { ...initialState, error: 'Ha ocurrido un error al generar tu CV. Inténtalo de nuevo.' };
      }
  };

  const [state, formAction] = useActionState(submitAction, initialState);

  return (
    <form action={formAction}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
            <Card>
              <CardHeader>
                <CardTitle>Generador de CV</CardTitle>
                <CardDescription>Completa tu información para generar un CV profesional asistido por IA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input name="fullName" id="fullName" placeholder="Ej: Ada Lovelace" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" id="email" type="email" placeholder="ej: ada@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Resumen Profesional</Label>
                  <Textarea name="summary" id="summary" placeholder="Apasionado desarrollador con experiencia en..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experiencia Laboral</Label>
                  <Textarea name="experience" id="experience" placeholder="Describe tu experiencia laboral, un puesto por línea." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Educación</Label>
                  <Textarea name="education" id="education" placeholder="Describe tu formación académica." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Habilidades</Label>
                  <Input name="skills" id="skills" placeholder="Ej: React, Next.js, TypeScript, Node.js" />
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
              {state.error && <p className="text-sm text-destructive p-4">{state.error}</p>}
            </Card>
        </div>
        <div className="space-y-6">
          <CvResults state={state} />
        </div>
      </div>
    </form>
  )
}

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Tu Perfil Profesional</h1>
        <p className="text-muted-foreground">Herramientas para construir un perfil que impresione a los reclutadores.</p>
      </header>

      <Tabs defaultValue="cv-generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cv-generator">Generador de CV</TabsTrigger>
          <TabsTrigger value="github-visualizer">Visualizador de GitHub</TabsTrigger>
          <TabsTrigger value="self-assessment">Autodiagnóstico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cv-generator" className="mt-6">
          <CvGeneratorTab />
        </TabsContent>

        <TabsContent value="github-visualizer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualizador de Perfil de GitHub</CardTitle>
              <CardDescription>Compara un perfil básico con uno optimizado y aprende a mejorar el tuyo.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><XCircle className="text-destructive"/> Perfil Básico</h3>
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">README.md vacío</CardTitle>
                    <CardDescription>Sin descripción, sin proyectos destacados.</CardDescription>
                  </CardHeader>
                </Card>
                 <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Commits genéricos</CardTitle>
                    <CardDescription>"final changes", "fix", "update"</CardDescription>
                  </CardHeader>
                </Card>
                 <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Proyectos no pineados</CardTitle>
                    <CardDescription>Los mejores proyectos no son visibles.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle className="text-primary"/> Perfil Ideal</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">README.md completo</CardTitle>
                    <CardDescription>Presentación, stack, links de contacto y proyectos.</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Commits descriptivos</CardTitle>
                    <CardDescription>"feat(auth): add google sign-in", "fix(ui): correct modal alignment"</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Proyectos destacados (Pinned)</CardTitle>
                    <CardDescription>Muestra tus 6 mejores proyectos con descripciones claras.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Mini-reto: Limpia tu GitHub en 3 pasos</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="self-assessment" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Test de Autodiagnóstico</CardTitle>
              <CardDescription>Identifica tus fortalezas y áreas de mejora. (Funcionalidad en desarrollo)</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground p-12">
              <p>El test interactivo estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

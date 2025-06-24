import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

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
          <Card>
            <CardHeader>
              <CardTitle>Generador de CV</CardTitle>
              <CardDescription>Completa tu información para generar un CV profesional. Elige una plantilla y descárgalo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input id="fullName" placeholder="Ej: Ada Lovelace" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="ej: ada@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Resumen Profesional</Label>
                <Textarea id="summary" placeholder="Apasionado desarrollador con experiencia en..." />
              </div>
              {/* More fields can be added here for experience, education, skills, etc. */}
              
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline">Elegir Plantilla</Button>
                 <Button>Generar y Descargar CV</Button>
            </CardFooter>
          </Card>
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

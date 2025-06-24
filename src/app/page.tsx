import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Bot, Briefcase, Code, Mic, User } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <User className="w-8 h-8 text-primary" />,
    title: "Tu Perfil Profesional",
    description: "Crea un CV y perfil de GitHub que destaquen.",
    href: "/profile",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Búsqueda de Empleo",
    description: "Encuentra las mejores plataformas para buscar trabajo.",
    href: "/jobs",
  },
  {
    icon: <Mic className="w-8 h-8 text-primary" />,
    title: "Marca Personal",
    description: "Aprende a venderte y a comunicarte con reclutadores.",
    href: "/personal-brand",
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Simulación de Entrevista",
    description: "Practica con simulaciones de entrevistas técnicas y de RRHH.",
    href: "/interview-prep",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 md:p-8">
      <main className="container mx-auto flex-1 flex flex-col items-center justify-center text-center">
        <header className="py-12 md:py-20">
          <Bot className="w-20 h-20 mx-auto text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mt-4">
            TechPrep Compass
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Prepárate para tu primer empleo como programador. Te guiamos en cada paso del camino, desde tu CV hasta la entrevista técnica.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/profile">Comienza tu preparación <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </header>

        <section className="w-full max-w-5xl py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.href} className="text-left hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={feature.href}>
                      Ir a la sección <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <footer className="py-12">
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
            "El éxito no es el final, el fracaso no es la ruina, el coraje de continuar es lo que cuenta."
            <cite className="block not-italic mt-2 font-semibold">- Desarrollador Exitoso Anónimo</cite>
          </blockquote>
        </footer>
      </main>
    </div>
  );
}

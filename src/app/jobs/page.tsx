'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';

const jobBoards = [
  { name: "LinkedIn", url: "https://www.linkedin.com/jobs/", description: "La red profesional más grande del mundo.", category: "general", logo: "https://logo.clearbit.com/linkedin.com" },
  { name: "GitHub Jobs", url: "https://github.com/jobs", description: "Directamente donde está el código.", category: "tech", logo: "https://logo.clearbit.com/github.com" },
  { name: "We Work Remotely", url: "https://weworkremotely.com/", description: "La comunidad más grande de trabajo remoto.", category: "remoto", logo: "https://logo.clearbit.com/weworkremotely.com" },
  { name: "Get on Board", url: "https://www.getonbrd.com/", description: "Especializado en trabajos de tecnología en Latam y España.", category: "latam", logo: "https://logo.clearbit.com/getonbrd.com" },
  { name: "Arc.dev", url: "https://arc.dev/remote-jobs", description: "Para desarrolladores remotos de élite.", category: "remoto", logo: "https://logo.clearbit.com/arc.dev" },
  { name: "Discords de Talento", url: "#", description: "Comunidades con canales de empleo exclusivos. (Explora en línea)", category: "comunidad", logo: "https://logo.clearbit.com/discord.com" },
];

const filters = [
  { label: "Todos", value: "all" },
  { label: "General", value: "general" },
  { label: "Tech Específico", value: "tech" },
  { label: "Remoto", value: "remoto" },
  { label: "Latam/España", value: "latam" },
  { label: "Comunidad", value: "comunidad" },
];


export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredBoards = activeFilter === 'all' 
    ? jobBoards 
    : jobBoards.filter(board => board.category === activeFilter);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Canales para Buscar Empleo</h1>
        <p className="text-muted-foreground">Explora las mejores plataformas para encontrar tu primer trabajo en tecnología.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filtra por categoría</CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.map(filter => (
              <Button 
                key={filter.value} 
                variant={activeFilter === filter.value ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map(board => (
             <Link key={board.name} href={board.url} target="_blank" rel="noopener noreferrer" className="block hover:shadow-lg transition-shadow rounded-lg">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Image src={board.logo} alt={`${board.name} logo`} width={40} height={40} className="rounded-sm" />
                    <CardTitle>{board.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{board.description}</p>
                  </CardContent>
                </Card>
            </Link>
          ))}
        </CardContent>
      </Card>
      
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tip Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            <strong>Aprende a leer entre líneas una oferta:</strong> No te desanimes si no cumples el 100% de los requisitos. Muchas veces las "listas de deseos" de las empresas son flexibles. Si cumples con el 60-70% y demuestras ganas de aprender, ¡aplica!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

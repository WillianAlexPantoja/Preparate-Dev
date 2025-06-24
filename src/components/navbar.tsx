'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/profile', label: 'Perfil Profesional' },
  { href: '/jobs', label: 'Búsqueda de Empleo' },
  { href: '/personal-brand', label: 'Marca Personal' },
  { href: '/interview-prep', label: 'Simulación de Entrevista' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="font-bold hidden sm:inline-block">
              TechPrep Compass
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex justify-center items-center gap-4 text-sm lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex justify-end">
          {/* Placeholder for future buttons */}
        </div>
      </div>
    </header>
  );
}

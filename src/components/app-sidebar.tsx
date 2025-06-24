'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Briefcase, Code, Home, Mic, User } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/profile', icon: User, label: 'Perfil Profesional' },
  { href: '/jobs', icon: Briefcase, label: 'Búsqueda de Empleo' },
  { href: '/personal-brand', icon: Mic, label: 'Marca Personal' },
  { href: '/interview-prep', icon: Code, label: 'Simulación de Entrevista' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-border/20"
    >
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            TechPrep Compass
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* Can add footer content here if needed */}
      </SidebarFooter>
    </Sidebar>
  );
}

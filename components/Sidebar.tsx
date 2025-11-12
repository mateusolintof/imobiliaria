'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  PlusCircle,
  List,
  DollarSign,
  TrendingUp,
  ArrowLeftRight,
  Settings,
  Building2,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
  description?: string
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: Home,
    description: 'Visão geral'
  },
  {
    path: '/cadastro',
    label: 'Cadastrar Imóvel',
    icon: PlusCircle,
    description: 'Adicionar novo'
  },
  {
    path: '/meus-imoveis',
    label: 'Meus Imóveis',
    icon: List,
    description: 'Lista completa'
  },
  {
    path: '/moradia',
    label: 'Análise Moradia',
    icon: DollarSign,
    description: 'Simulação de financiamento'
  },
  {
    path: '/investimento',
    label: 'Análise Investimento',
    icon: TrendingUp,
    description: 'Retorno sobre investimento'
  },
  {
    path: '/comparar',
    label: 'Comparar Imóveis',
    icon: ArrowLeftRight,
    description: 'Comparação lado a lado'
  },
]

const bottomNavItems: NavItem[] = [
  {
    path: '/parametros',
    label: 'Parâmetros',
    icon: Settings,
    description: 'Configurações'
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMobileOpen(false)
  }

  const NavItemComponent = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const Icon = item.icon

    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={cn(
          'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Icon className={cn(
          'h-5 w-5 shrink-0 transition-transform duration-200',
          isActive ? 'scale-110' : 'group-hover:scale-105'
        )} />
        <div className="flex-1 truncate">
          <div className={cn(
            'font-medium',
            isActive && 'font-semibold'
          )}>
            {item.label}
          </div>
          {item.description && !isActive && (
            <div className="text-xs opacity-60 truncate">
              {item.description}
            </div>
          )}
        </div>
        {isActive && (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
      </button>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo/Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Plataforma</h1>
            <p className="text-xs text-muted-foreground">Imobiliária</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItemComponent
                key={item.path}
                item={item}
                isActive={pathname === item.path}
              />
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-4">
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItemComponent
                key={item.path}
                item={item}
                isActive={pathname === item.path}
              />
            ))}
          </div>

          {/* User Info */}
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                MO
              </div>
              <div className="flex-1 truncate text-sm">
                <div className="font-medium">Mateus Olinto</div>
                <div className="text-xs text-muted-foreground">Usuário</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

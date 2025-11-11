'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Home,
  PlusCircle,
  List,
  DollarSign,
  TrendingUp,
  ArrowLeftRight,
  Settings
} from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

const routes = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/cadastro', label: 'Cadastro', icon: PlusCircle },
  { path: '/meus-imoveis', label: 'Meus Imóveis', icon: List },
  { path: '/moradia', label: 'Moradia', icon: DollarSign },
  { path: '/investimento', label: 'Investimento', icon: TrendingUp },
  { path: '/comparar', label: 'Comparar', icon: ArrowLeftRight },
  { path: '/parametros', label: 'Parâmetros', icon: Settings },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Plataforma Imobiliária</h1>
        </div>
        <Tabs
          value={pathname}
          onValueChange={(value) => router.push(value)}
          className="w-full border-t border-primary-dark/20"
        >
          <TabsList className="h-auto w-full justify-start rounded-none bg-primary-dark/10 p-0">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <TabsTrigger
                  key={route.path}
                  value={route.path}
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-white data-[state=active]:bg-primary-dark/20"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{route.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </header>

      <main className="flex-1 bg-gray-50 py-6">
        {children}
      </main>

      <footer className="border-t bg-white py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Plataforma de Análise Imobiliária © {new Date().getFullYear()}
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Os dados e simulações fornecidos não constituem aconselhamento financeiro ou tributário.
          </p>
        </div>
      </footer>
    </div>
  )
}

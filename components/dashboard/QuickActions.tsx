import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  PlusCircle,
  List,
  DollarSign,
  TrendingUp,
  ArrowLeftRight
} from 'lucide-react'

interface QuickAction {
  label: string
  description: string
  icon: React.ElementType
  href: string
  variant?: 'default' | 'outline' | 'secondary'
}

const quickActions: QuickAction[] = [
  {
    label: 'Cadastrar Imóvel',
    description: 'Adicione um novo imóvel ao seu portfólio',
    icon: PlusCircle,
    href: '/cadastro',
    variant: 'default'
  },
  {
    label: 'Ver Todos',
    description: 'Gerencie seus imóveis cadastrados',
    icon: List,
    href: '/meus-imoveis',
    variant: 'outline'
  },
  {
    label: 'Simular Moradia',
    description: 'Calcule financiamento e custos',
    icon: DollarSign,
    href: '/moradia',
    variant: 'outline'
  },
  {
    label: 'Analisar Investimento',
    description: 'Avalie retorno e rentabilidade',
    icon: TrendingUp,
    href: '/investimento',
    variant: 'outline'
  },
  {
    label: 'Comparar Imóveis',
    description: 'Compare lado a lado',
    icon: ArrowLeftRight,
    href: '/comparar',
    variant: 'outline'
  },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Ações Rápidas</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.href}
              variant={action.variant}
              className="h-auto justify-start gap-3 p-4 text-left"
              onClick={() => router.push(action.href)}
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{action.label}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}

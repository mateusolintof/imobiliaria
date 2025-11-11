'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Home, HardHat } from 'lucide-react'
import { PropertyType } from '@/types'
import { cn } from '@/lib/utils'

interface PropertyTypeStepProps {
  type: PropertyType
  onChange: (type: PropertyType) => void
  error?: string
}

export default function PropertyTypeStep({ type, onChange, error }: PropertyTypeStepProps) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Selecione o tipo de imóvel</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Escolha se o imóvel está pronto ou na planta
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            type === 'ready' ? 'border-2 border-primary ring-2 ring-primary/20' : 'border-2 border-transparent'
          )}
          onClick={() => onChange('ready')}
        >
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Home className={cn('mb-4 h-16 w-16', type === 'ready' ? 'text-primary' : 'text-muted-foreground')} />
            <h3 className="mb-2 text-lg font-semibold">Imóvel Pronto</h3>
            <p className="text-sm text-muted-foreground">
              Imóvel já construído e disponível para compra imediata
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            type === 'under_construction' ? 'border-2 border-primary ring-2 ring-primary/20' : 'border-2 border-transparent'
          )}
          onClick={() => onChange('under_construction')}
        >
          <CardContent className="flex flex-col items-center p-6 text-center">
            <HardHat className={cn('mb-4 h-16 w-16', type === 'under_construction' ? 'text-primary' : 'text-muted-foreground')} />
            <h3 className="mb-2 text-lg font-semibold">Na Planta</h3>
            <p className="text-sm text-muted-foreground">
              Imóvel em construção com previsão de entrega futura
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

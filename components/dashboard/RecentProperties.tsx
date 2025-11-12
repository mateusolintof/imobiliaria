import React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Property } from '@/types'
import { MapPin, Home, ArrowRight, ImageIcon } from 'lucide-react'

interface RecentPropertiesProps {
  properties: Property[]
}

export default function RecentProperties({ properties }: RecentPropertiesProps) {
  const router = useRouter()

  if (properties.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Imóveis Recentes</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Home className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="mb-2 text-lg font-semibold">Nenhum imóvel cadastrado</h4>
          <p className="mb-4 text-sm text-muted-foreground">
            Comece adicionando seu primeiro imóvel para começar a análise.
          </p>
          <Button onClick={() => router.push('/cadastro')}>
            Cadastrar Primeiro Imóvel
          </Button>
        </div>
      </Card>
    )
  }

  // Show only the 3 most recent properties
  const recentProperties = properties.slice(0, 3)

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Imóveis Recentes</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/meus-imoveis')}
          className="gap-1"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {recentProperties.map((property) => {
          const coverImage = property.images?.[0]
          const totalPrice = property.price + (property.condoFee || 0) + (property.iptu || 0)

          return (
            <div
              key={property.id}
              className="group flex gap-4 rounded-lg border p-4 transition-all duration-200 hover:border-primary hover:shadow-sm cursor-pointer"
              onClick={() => router.push(`/meus-imoveis?highlight=${property.id}`)}
            >
              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={property.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold leading-tight text-foreground group-hover:text-primary">
                      {property.name}
                    </h4>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {property.type === 'apartment' && 'Apartamento'}
                      {property.type === 'house' && 'Casa'}
                      {property.type === 'land' && 'Terreno'}
                      {property.type === 'commercial' && 'Comercial'}
                    </Badge>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      {totalPrice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {property.area} m²
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import MainLayout from '@/components/MainLayout'
import { useProperties } from '@/hooks/useProperties'
import { Property } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Home,
  HardHat,
  Ruler,
  Bed,
  Bath,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  X,
  Plus,
} from 'lucide-react'
import { formatCurrency, formatArea, formatDate } from '@/utils/helpers'
import { cn } from '@/lib/utils'

export default function CompararPage() {
  const { properties, loading } = useProperties()
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([])

  // Propriedades selecionadas
  const selectedProperties = useMemo(() => {
    return selectedPropertyIds
      .map((id) => properties.find((p) => p.id === id))
      .filter((p): p is Property => p !== undefined)
  }, [selectedPropertyIds, properties])

  // Propriedades disponíveis para seleção (excluindo já selecionadas)
  const availableProperties = useMemo(() => {
    return properties.filter((p) => !selectedPropertyIds.includes(p.id))
  }, [properties, selectedPropertyIds])

  const handleAddProperty = (propertyId: string) => {
    if (selectedPropertyIds.length < 4) {
      setSelectedPropertyIds((prev) => [...prev, propertyId])
    }
  }

  const handleRemoveProperty = (propertyId: string) => {
    setSelectedPropertyIds((prev) => prev.filter((id) => id !== propertyId))
  }

  const canAddMore = selectedPropertyIds.length < 4

  // Calcula preço total e preço por m² para cada propriedade
  const getPropertyPrice = (property: Property) => {
    return property.type === 'ready'
      ? property.readyPrice || 0
      : (property.pricePerSqm || 0) * property.privateArea
  }

  const getPricePerSqm = (property: Property) => {
    const totalPrice = getPropertyPrice(property)
    return totalPrice / property.privateArea
  }

  // Encontra o melhor valor para cada métrica
  const getBestValue = (metric: keyof Property | 'totalPrice' | 'pricePerSqm') => {
    if (selectedProperties.length === 0) return null

    if (metric === 'totalPrice') {
      return Math.min(...selectedProperties.map(getPropertyPrice))
    }

    if (metric === 'pricePerSqm') {
      return Math.min(...selectedProperties.map(getPricePerSqm))
    }

    // Para área privativa, quartos, vagas, etc. - maior é melhor
    if (['privateArea', 'bedrooms', 'bathrooms', 'parkingSpots', 'suites'].includes(metric)) {
      return Math.max(...selectedProperties.map((p) => Number(p[metric]) || 0))
    }

    // Para custos (condomínio, IPTU) - menor é melhor
    if (['condoFee', 'iptu'].includes(metric)) {
      return Math.min(...selectedProperties.map((p) => Number(p[metric]) || 0))
    }

    return null
  }

  const isBestValue = (property: Property, metric: keyof Property | 'totalPrice' | 'pricePerSqm') => {
    const bestValue = getBestValue(metric)
    if (bestValue === null) return false

    if (metric === 'totalPrice') {
      return getPropertyPrice(property) === bestValue
    }

    if (metric === 'pricePerSqm') {
      return getPricePerSqm(property) === bestValue
    }

    return Number(property[metric]) === bestValue
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Carregando imóveis...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Comparar Imóveis</h1>
          <p className="text-muted-foreground">
            Compare múltiplos imóveis lado a lado para tomar a melhor decisão
          </p>
        </div>

        {/* Seleção de Propriedades */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Selecionar Imóveis para Comparação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Propriedades Selecionadas */}
              {selectedProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-2 rounded-lg border bg-primary/5 px-3 py-2"
                >
                  {property.type === 'ready' ? (
                    <Home className="h-4 w-4 text-primary" />
                  ) : (
                    <HardHat className="h-4 w-4 text-secondary" />
                  )}
                  <span className="text-sm font-medium">{property.name}</span>
                  <button
                    onClick={() => handleRemoveProperty(property.id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}

              {/* Botão para adicionar mais */}
              {canAddMore && availableProperties.length > 0 && (
                <Select onValueChange={handleAddProperty}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Adicionar imóvel..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        <div className="flex items-center gap-2">
                          {property.type === 'ready' ? (
                            <Home className="h-4 w-4" />
                          ) : (
                            <HardHat className="h-4 w-4" />
                          )}
                          <span>{property.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedPropertyIds.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Selecione pelo menos 2 imóveis para começar a comparação
              </p>
            )}

            {selectedPropertyIds.length === 4 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Limite máximo de 4 imóveis atingido
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Comparação */}
        {selectedProperties.length >= 2 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[800px] rounded-lg border bg-white">
              {/* Cabeçalho com nomes das propriedades */}
              <div className="grid gap-4 border-b bg-muted/50 p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="font-semibold">Característica</div>
                {selectedProperties.map((property) => (
                  <div key={property.id} className="text-center">
                    <div className="mb-1 flex items-center justify-center gap-1">
                      {property.type === 'ready' ? (
                        <Home className="h-4 w-4 text-primary" />
                      ) : (
                        <HardHat className="h-4 w-4 text-secondary" />
                      )}
                      <Badge variant={property.type === 'ready' ? 'default' : 'secondary'} className="text-xs">
                        {property.type === 'ready' ? 'Pronto' : 'Na Planta'}
                      </Badge>
                    </div>
                    <div className="text-sm font-semibold">{property.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {property.address.neighborhood}, {property.address.city}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preço */}
              <div className="grid gap-4 border-b p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Preço Total</span>
                </div>
                {selectedProperties.map((property) => {
                  const price = getPropertyPrice(property)
                  const isBest = isBestValue(property, 'totalPrice')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('text-lg font-bold', isBest && 'text-green-600')}>
                        {formatCurrency(price)}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Preço por m² */}
              <div className="grid gap-4 border-b bg-muted/20 p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Preço/m²</span>
                </div>
                {selectedProperties.map((property) => {
                  const pricePerSqm = getPricePerSqm(property)
                  const isBest = isBestValue(property, 'pricePerSqm')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {formatCurrency(pricePerSqm)}/m²
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Área Privativa */}
              <div className="grid gap-4 border-b p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Área Privativa</span>
                </div>
                {selectedProperties.map((property) => {
                  const isBest = isBestValue(property, 'privateArea')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {formatArea(property.privateArea)}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Quartos */}
              <div className="grid gap-4 border-b bg-muted/20 p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Quartos</span>
                </div>
                {selectedProperties.map((property) => {
                  const isBest = isBestValue(property, 'bedrooms')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                      {property.suites > 0 && (
                        <div className="text-xs text-muted-foreground">
                          ({property.suites} {property.suites === 1 ? 'suíte' : 'suítes'})
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Banheiros */}
              <div className="grid gap-4 border-b p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Banheiros</span>
                </div>
                {selectedProperties.map((property) => {
                  const isBest = isBestValue(property, 'bathrooms')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {property.bathrooms}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Vagas de Garagem */}
              <div className="grid gap-4 border-b bg-muted/20 p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Vagas de Garagem</span>
                </div>
                {selectedProperties.map((property) => {
                  const isBest = isBestValue(property, 'parkingSpots')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {property.parkingSpots} {property.parkingSpots === 1 ? 'vaga' : 'vagas'}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Condomínio */}
              <div className="grid gap-4 border-b p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Condomínio</span>
                </div>
                {selectedProperties.map((property) => {
                  const isBest = property.condoFee > 0 && isBestValue(property, 'condoFee')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {property.condoFee > 0 ? formatCurrency(property.condoFee) : 'N/A'}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                      {property.condoFee > 0 && (
                        <div className="text-xs text-muted-foreground">/mês</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* IPTU */}
              <div className="grid gap-4 border-b bg-muted/20 p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">IPTU</span>
                </div>
                {selectedProperties.map((property) => {
                  const isBest = property.iptu > 0 && isBestValue(property, 'iptu')
                  return (
                    <div key={property.id} className="text-center">
                      <div className={cn('font-semibold', isBest && 'text-green-600')}>
                        {property.iptu > 0 ? formatCurrency(property.iptu) : 'N/A'}
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </div>
                      {property.iptu > 0 && (
                        <div className="text-xs text-muted-foreground">/ano</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Data de Entrega (para na planta) */}
              {selectedProperties.some((p) => p.type === 'under_construction') && (
                <div className="grid gap-4 border-b p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Data de Entrega</span>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="text-center">
                      <div className="font-semibold">
                        {property.type === 'under_construction' && property.deliveryDate
                          ? formatDate(property.deliveryDate, 'MM/yyyy')
                          : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Localização */}
              <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Endereço Completo</span>
                </div>
                {selectedProperties.map((property) => (
                  <div key={property.id} className="text-center">
                    <div className="text-sm">
                      {property.address.street}
                      {property.address.number && `, ${property.address.number}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {property.address.neighborhood}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {property.address.city} - {property.address.state}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legenda */}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-green-600">✓</span>
              <span>Melhor valor nesta categoria</span>
            </div>

            {/* Ações */}
            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedPropertyIds([])}
              >
                Limpar Comparação
              </Button>
              <Button
                onClick={() => window.print()}
              >
                Imprimir Comparação
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <Plus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Nenhuma comparação ativa</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione pelo menos 2 imóveis acima para começar a comparação
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

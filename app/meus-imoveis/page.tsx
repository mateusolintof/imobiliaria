'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { PlusCircle, Search, Loader2 } from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import PropertyCard from '@/components/PropertyCard'
import { useProperties } from '@/hooks/useProperties'
import { PropertyType } from '@/types'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MeusImoveisPage() {
  const router = useRouter()
  const { properties, loading, error } = useProperties()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'area'>('newest')

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((prop) =>
        prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((prop) => prop.type === typeFilter)
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price':
          const priceA = a.type === 'ready' ? (a.readyPrice || 0) : (a.pricePerSqm || 0) * a.privateArea
          const priceB = b.type === 'ready' ? (b.readyPrice || 0) : (b.pricePerSqm || 0) * b.privateArea
          return priceB - priceA
        case 'area':
          return b.privateArea - a.privateArea
        default:
          return 0
      }
    })

    return sorted
  }, [properties, searchTerm, typeFilter, sortBy])

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-bold">
              Meus Imóveis
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'imóvel' : 'imóveis'}
            </p>
          </div>
          <Button onClick={() => router.push('/cadastro')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtros */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-12">
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, bairro ou cidade"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="sm:col-span-3">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PropertyType | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ready">Pronto</SelectItem>
                <SelectItem value="under_construction">Na Planta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-3">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'newest' | 'price' | 'area')}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="price">Maior Preço</SelectItem>
                <SelectItem value="area">Maior Área</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de Imóveis */}
        {filteredAndSortedProperties.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-xl font-semibold text-muted-foreground">
              {properties.length === 0 ? 'Nenhum imóvel cadastrado' : 'Nenhum imóvel encontrado'}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {properties.length === 0
                ? 'Comece adicionando seu primeiro imóvel ao portfólio'
                : 'Tente ajustar os filtros de busca'}
            </p>
            {properties.length === 0 && (
              <Button variant="outline" onClick={() => router.push('/cadastro')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Primeiro Imóvel
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

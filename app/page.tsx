'use client'

import { useEffect, useState } from 'react'
import MainLayout from '@/components/MainLayout'
import StatCard from '@/components/dashboard/StatCard'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentProperties from '@/components/dashboard/RecentProperties'
import { Property } from '@/types'
import { getProperties } from '@/lib/supabase'
import {
  Building2,
  DollarSign,
  TrendingUp,
  PieChart,
  Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const data = await getProperties()
      // Sort by creation date (most recent first)
      const sorted = data.sort((a, b) => {
        if (!a.id || !b.id) return 0
        return b.id.localeCompare(a.id)
      })
      setProperties(sorted)
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const totalProperties = properties.length

  const totalValue = properties.reduce((sum, property) => {
    const basePrice =
      property.type === 'ready'
        ? property.readyPrice || 0
        : (property.pricePerSqm || 0) * property.privateArea
    return sum + basePrice
  }, 0)

  const avgPricePerSqm =
    properties.length > 0
      ? properties.reduce((sum, property) => {
          const pricePerSqm =
            property.type === 'ready' && property.readyPrice
              ? property.readyPrice / property.privateArea
              : property.pricePerSqm || 0
          return sum + pricePerSqm
        }, 0) / properties.length
      : 0

  // Count properties by type
  const propertyTypes = properties.reduce((acc, property) => {
    acc[property.type] = (acc[property.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const readyCount = propertyTypes['ready'] || 0
  const underConstructionCount = propertyTypes['under_construction'] || 0

  const mostCommonType = readyCount >= underConstructionCount ? 'ready' : 'under_construction'
  const mostCommonCount = Math.max(readyCount, underConstructionCount, 0)
  const mostCommonTypeLabel = properties.length > 0
    ? mostCommonType === 'ready'
      ? 'Prontos'
      : 'Na Planta'
    : 'Nenhum'

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Visão geral do seu portfólio imobiliário
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Imóveis"
            value={totalProperties}
            description={totalProperties === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}
            icon={Building2}
          />

          <StatCard
            title="Valor Total"
            value={totalValue.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
            description="Soma de todos os imóveis"
            icon={DollarSign}
          />

          <StatCard
            title="Preço Médio/m²"
            value={
              avgPricePerSqm > 0
                ? avgPricePerSqm.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : 'R$ 0'
            }
            description="Média do portfólio"
            icon={TrendingUp}
          />

          <StatCard
            title="Tipo Mais Comum"
            value={mostCommonCount}
            description={mostCommonTypeLabel}
            icon={PieChart}
          />
        </div>

        {/* Distribution Chart */}
        {properties.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Distribuição por Tipo</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(propertyTypes).map(([type, count]) => {
                const percentage = (count / totalProperties) * 100
                const typeLabel = type === 'ready' ? 'Imóveis Prontos' : 'Imóveis Na Planta'

                return (
                  <div key={type} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{typeLabel}</span>
                      <span className="text-2xl font-bold text-primary">{count}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {percentage.toFixed(1)}% do portfólio
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Properties */}
        <RecentProperties properties={properties} />
      </div>
    </MainLayout>
  )
}

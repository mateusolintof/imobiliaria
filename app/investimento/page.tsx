'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import { useProperties } from '@/hooks/useProperties'
import { usePreferences } from '@/hooks/usePreferences'
import { Property } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, TrendingUp, DollarSign, Calendar, Percent, Target } from 'lucide-react'
import {
  calculateInvestmentAnalysis,
  calculateCashFlowProjection,
  calculatePaybackPeriod,
  calculateIRR,
  InvestmentAnalysis,
  CashFlow,
} from '@/lib/financialCalc'
import { formatCurrency } from '@/utils/helpers'

export default function InvestimentoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const { properties, loading: propertiesLoading, getPropertyById } = useProperties()
  const { preferences, loading: preferencesLoading } = usePreferences()

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [monthlyRent, setMonthlyRent] = useState(0)
  const [maintenancePercent, setMaintenancePercent] = useState(5)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [appreciationRate, setAppreciationRate] = useState(5)
  const [rentIncreaseRate, setRentIncreaseRate] = useState(4)
  const [downPayment, setDownPayment] = useState(0)
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null)
  const [cashFlowProjection, setCashFlowProjection] = useState<CashFlow[]>([])

  useEffect(() => {
    if (propertyId && !selectedProperty) {
      loadProperty(propertyId)
    }
  }, [propertyId])

  useEffect(() => {
    if (preferences) {
      setMaintenancePercent(preferences.defaultMaintenancePercent || 5)
      setVacancyRate(preferences.defaultVacancyRate || 5)
      setAppreciationRate(preferences.defaultAnnualAppreciation || 5)
    }
  }, [preferences])

  useEffect(() => {
    if (selectedProperty) {
      const totalPrice = selectedProperty.type === 'ready'
        ? selectedProperty.readyPrice || 0
        : (selectedProperty.pricePerSqm || 0) * selectedProperty.privateArea

      // Estima aluguel em 0.5% do valor do imóvel
      setMonthlyRent(totalPrice * 0.005)
      setDownPayment(totalPrice * 0.3) // 30% de entrada
    }
  }, [selectedProperty])

  const loadProperty = async (id: string) => {
    const property = await getPropertyById(id)
    if (property) {
      setSelectedProperty(property)
    }
  }

  const totalPrice = useMemo(() => {
    if (!selectedProperty) return 0
    return selectedProperty.type === 'ready'
      ? selectedProperty.readyPrice || 0
      : (selectedProperty.pricePerSqm || 0) * selectedProperty.privateArea
  }, [selectedProperty])

  const handleAnalyze = () => {
    if (!selectedProperty || totalPrice === 0) return

    const investmentAnalysis = calculateInvestmentAnalysis(
      totalPrice,
      monthlyRent,
      selectedProperty.condoFee || 0,
      selectedProperty.iptu || 0,
      maintenancePercent,
      vacancyRate,
      appreciationRate,
      downPayment
    )

    setAnalysis(investmentAnalysis)

    // Projeção de 10 anos
    const monthlyExpenses =
      (selectedProperty.condoFee || 0) +
      ((selectedProperty.iptu || 0) / 12) +
      (monthlyRent * (maintenancePercent / 100)) +
      (monthlyRent * (vacancyRate / 100))

    const projection = calculateCashFlowProjection(
      totalPrice,
      monthlyRent,
      monthlyExpenses,
      appreciationRate,
      rentIncreaseRate,
      10
    )

    setCashFlowProjection(projection)
  }

  const paybackPeriod = useMemo(() => {
    if (!analysis || !downPayment) return 0
    return calculatePaybackPeriod(downPayment, analysis.netOperatingIncome)
  }, [analysis, downPayment])

  const irr = useMemo(() => {
    if (cashFlowProjection.length === 0 || !downPayment) return 0
    const cashFlows = cashFlowProjection.map((cf) => cf.totalReturn)
    return calculateIRR(downPayment, cashFlows)
  }, [cashFlowProjection, downPayment])

  if (propertiesLoading || preferencesLoading) {
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
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Análise de Investimento</h1>
          <p className="text-sm text-muted-foreground">
            Analise a rentabilidade e potencial de retorno do investimento
          </p>
        </div>

        {/* Seleção de Imóvel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecione o Imóvel</CardTitle>
            <CardDescription>Escolha um imóvel para analisar como investimento</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedProperty?.id || ''}
              onValueChange={(value) => {
                const property = properties.find((p) => p.id === value)
                setSelectedProperty(property || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um imóvel" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => {
                  const price = property.type === 'ready'
                    ? property.readyPrice || 0
                    : (property.pricePerSqm || 0) * property.privateArea
                  return (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {formatCurrency(price)}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {selectedProperty && (
              <div className="mt-4 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedProperty.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProperty.address.neighborhood}, {selectedProperty.address.city}
                    </p>
                  </div>
                  <Badge variant={selectedProperty.type === 'ready' ? 'default' : 'secondary'}>
                    {selectedProperty.type === 'ready' ? 'Pronto' : 'Na Planta'}
                  </Badge>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-semibold">{formatCurrency(totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Condomínio</p>
                    <p className="font-semibold">{formatCurrency(selectedProperty.condoFee || 0)}/mês</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IPTU</p>
                    <p className="font-semibold">{formatCurrency(selectedProperty.iptu || 0)}/ano</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Área</p>
                    <p className="font-semibold">{selectedProperty.privateArea}m²</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parâmetros */}
        {selectedProperty && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Parâmetros do Investimento</CardTitle>
                <CardDescription>Configure os valores para análise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="monthlyRent">Aluguel Mensal Estimado (R$)</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      step="100"
                      min="0"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {((monthlyRent * 12 / totalPrice) * 100).toFixed(2)}% ao ano
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="downPayment">Investimento Inicial (R$)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      step="1000"
                      min="0"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {((downPayment / totalPrice) * 100).toFixed(1)}% do valor
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="maintenancePercent">Manutenção (% do aluguel)</Label>
                    <Input
                      id="maintenancePercent"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={maintenancePercent}
                      onChange={(e) => setMaintenancePercent(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vacancyRate">Taxa de Vacância (%)</Label>
                    <Input
                      id="vacancyRate"
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="appreciationRate">Valorização Anual (%)</Label>
                    <Input
                      id="appreciationRate"
                      type="number"
                      step="0.5"
                      min="-10"
                      max="20"
                      value={appreciationRate}
                      onChange={(e) => setAppreciationRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rentIncreaseRate">Reajuste do Aluguel (%/ano)</Label>
                    <Input
                      id="rentIncreaseRate"
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={rentIncreaseRate}
                      onChange={(e) => setRentIncreaseRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleAnalyze} size="lg">
                    <Target className="mr-2 h-4 w-4" />
                    Analisar Investimento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Análise</CardTitle>
                  <CardDescription>
                    Métricas de rentabilidade e retorno do investimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="metrics" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="metrics">Métricas</TabsTrigger>
                      <TabsTrigger value="projection">Projeção 10 Anos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metrics" className="mt-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Cap Rate */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <Percent className="h-8 w-8 text-primary" />
                              <span className="text-3xl font-bold">{analysis.capRate.toFixed(2)}%</span>
                            </div>
                            <p className="mt-2 text-sm font-medium">Cap Rate</p>
                            <p className="text-xs text-muted-foreground">Taxa de Capitalização</p>
                          </CardContent>
                        </Card>

                        {/* Rentabilidade Bruta */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <TrendingUp className="h-8 w-8 text-green-600" />
                              <span className="text-3xl font-bold">{analysis.grossYield.toFixed(2)}%</span>
                            </div>
                            <p className="mt-2 text-sm font-medium">Rentabilidade Bruta</p>
                            <p className="text-xs text-muted-foreground">Anual</p>
                          </CardContent>
                        </Card>

                        {/* Rentabilidade Líquida */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <DollarSign className="h-8 w-8 text-blue-600" />
                              <span className="text-3xl font-bold">{analysis.netYield.toFixed(2)}%</span>
                            </div>
                            <p className="mt-2 text-sm font-medium">Rentabilidade Líquida</p>
                            <p className="text-xs text-muted-foreground">Anual</p>
                          </CardContent>
                        </Card>

                        {/* Cash on Cash Return */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <Target className="h-8 w-8 text-purple-600" />
                              <span className="text-3xl font-bold">{analysis.cashOnCashReturn.toFixed(2)}%</span>
                            </div>
                            <p className="mt-2 text-sm font-medium">Cash on Cash</p>
                            <p className="text-xs text-muted-foreground">Retorno sobre capital investido</p>
                          </CardContent>
                        </Card>

                        {/* Payback */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <Calendar className="h-8 w-8 text-orange-600" />
                              <span className="text-3xl font-bold">{paybackPeriod.toFixed(1)}</span>
                            </div>
                            <p className="mt-2 text-sm font-medium">Payback</p>
                            <p className="text-xs text-muted-foreground">Anos para recuperar investimento</p>
                          </CardContent>
                        </Card>

                        {/* TIR */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <Percent className="h-8 w-8 text-red-600" />
                              <span className="text-3xl font-bold">{irr.toFixed(2)}%</span>
                            </div>
                            <p className="mt-2 text-sm font-medium">TIR</p>
                            <p className="text-xs text-muted-foreground">Taxa Interna de Retorno</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Detalhamento */}
                      <div className="mt-6 rounded-lg bg-muted p-6">
                        <h4 className="mb-4 font-semibold">Detalhamento Financeiro</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Receita Anual (Aluguel)</p>
                            <p className="text-lg font-semibold">{formatCurrency(analysis.annualRent)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Despesas Operacionais</p>
                            <p className="text-lg font-semibold">{formatCurrency(analysis.operatingExpenses)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">NOI (Lucro Operacional Líquido)</p>
                            <p className="text-lg font-semibold text-green-600">{formatCurrency(analysis.netOperatingIncome)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Valorização Estimada (Anual)</p>
                            <p className="text-lg font-semibold">{formatCurrency(analysis.estimatedAppreciation)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Retorno Total Anual</p>
                            <p className="text-lg font-semibold text-primary">{formatCurrency(analysis.totalReturn)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Break Even (Ocupação Mínima)</p>
                            <p className="text-lg font-semibold">{analysis.breakEvenOccupancy.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="projection" className="mt-6">
                      <div className="rounded-lg border">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted">
                              <tr>
                                <th className="p-2 text-left">Ano</th>
                                <th className="p-2 text-right">Aluguel</th>
                                <th className="p-2 text-right">Despesas</th>
                                <th className="p-2 text-right">Lucro Líquido</th>
                                <th className="p-2 text-right">Valorização</th>
                                <th className="p-2 text-right">Retorno Total</th>
                                <th className="p-2 text-right">Acumulado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cashFlowProjection.map((cf) => (
                                <tr key={cf.year} className="border-t">
                                  <td className="p-2 font-medium">{cf.year}</td>
                                  <td className="p-2 text-right">{formatCurrency(cf.rent)}</td>
                                  <td className="p-2 text-right text-red-600">{formatCurrency(cf.expenses)}</td>
                                  <td className="p-2 text-right">{formatCurrency(cf.netIncome)}</td>
                                  <td className="p-2 text-right text-green-600">{formatCurrency(cf.appreciation)}</td>
                                  <td className="p-2 text-right font-semibold">{formatCurrency(cf.totalReturn)}</td>
                                  <td className="p-2 text-right font-semibold text-primary">{formatCurrency(cf.cumulativeReturn)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="sticky bottom-0 bg-muted font-semibold">
                              <tr>
                                <td className="p-2">TOTAL</td>
                                <td className="p-2 text-right">
                                  {formatCurrency(cashFlowProjection.reduce((sum, cf) => sum + cf.rent, 0))}
                                </td>
                                <td className="p-2 text-right">
                                  {formatCurrency(cashFlowProjection.reduce((sum, cf) => sum + cf.expenses, 0))}
                                </td>
                                <td className="p-2 text-right">
                                  {formatCurrency(cashFlowProjection.reduce((sum, cf) => sum + cf.netIncome, 0))}
                                </td>
                                <td className="p-2 text-right">
                                  {formatCurrency(cashFlowProjection.reduce((sum, cf) => sum + cf.appreciation, 0))}
                                </td>
                                <td className="p-2 text-right">
                                  {formatCurrency(cashFlowProjection.reduce((sum, cf) => sum + cf.totalReturn, 0))}
                                </td>
                                <td className="p-2 text-right text-primary">
                                  {formatCurrency(cashFlowProjection[cashFlowProjection.length - 1]?.cumulativeReturn || 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg bg-muted p-4">
                        <p className="text-sm">
                          <strong>ROI em 10 anos:</strong>{' '}
                          {(((cashFlowProjection[cashFlowProjection.length - 1]?.cumulativeReturn || 0) / downPayment) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}

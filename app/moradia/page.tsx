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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, TrendingDown, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import { calculateSAC, calculatePRICE, calculatePaymentToIncomeRatio, FinancingSimulation } from '@/lib/financialCalc'
import { formatCurrency } from '@/utils/helpers'

export default function MoradiaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const { properties, loading: propertiesLoading, getPropertyById } = useProperties()
  const { preferences, loading: preferencesLoading } = usePreferences()

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [downPayment, setDownPayment] = useState(0)
  const [years, setYears] = useState(30)
  const [interestRate, setInterestRate] = useState(9.5)
  const [simulationSAC, setSimulationSAC] = useState<FinancingSimulation | null>(null)
  const [simulationPRICE, setSimulationPRICE] = useState<FinancingSimulation | null>(null)

  useEffect(() => {
    if (propertyId && !selectedProperty) {
      loadProperty(propertyId)
    }
  }, [propertyId])

  useEffect(() => {
    if (preferences && !interestRate) {
      setInterestRate(preferences.defaultInterestRate || 9.5)
    }
  }, [preferences])

  useEffect(() => {
    if (selectedProperty) {
      const totalPrice = selectedProperty.type === 'ready'
        ? selectedProperty.readyPrice || 0
        : (selectedProperty.pricePerSqm || 0) * selectedProperty.privateArea
      setDownPayment(totalPrice * 0.2) // 20% inicial por padrão
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

  const handleSimulate = () => {
    if (!selectedProperty || totalPrice === 0) return

    const sac = calculateSAC(totalPrice, downPayment, interestRate, years)
    const price = calculatePRICE(totalPrice, downPayment, interestRate, years)

    setSimulationSAC(sac)
    setSimulationPRICE(price)
  }

  const paymentToIncomeRatioSAC = useMemo(() => {
    if (!simulationSAC || !preferences?.monthlyIncome) return 0
    return calculatePaymentToIncomeRatio(simulationSAC.firstPayment, preferences.monthlyIncome)
  }, [simulationSAC, preferences])

  const paymentToIncomeRatioPRICE = useMemo(() => {
    if (!simulationPRICE || !preferences?.monthlyIncome) return 0
    return calculatePaymentToIncomeRatio(simulationPRICE.firstPayment, preferences.monthlyIncome)
  }, [simulationPRICE, preferences])

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
          <h1 className="mb-2 text-3xl font-bold">Simulação para Moradia</h1>
          <p className="text-sm text-muted-foreground">
            Simule diferentes cenários de financiamento e compare as opções
          </p>
        </div>

        {/* Seleção de Imóvel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecione o Imóvel</CardTitle>
            <CardDescription>Escolha um imóvel do seu portfólio para simular</CardDescription>
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
                    <p className="text-muted-foreground">Valor Total</p>
                    <p className="font-semibold">{formatCurrency(totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Área</p>
                    <p className="font-semibold">{selectedProperty.privateArea}m²</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quartos</p>
                    <p className="font-semibold">{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vagas</p>
                    <p className="font-semibold">{selectedProperty.parkingSpots}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuração da Simulação */}
        {selectedProperty && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Parâmetros do Financiamento</CardTitle>
                <CardDescription>Configure os valores para simular o financiamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="downPayment">Entrada (R$)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      step="1000"
                      min="0"
                      max={totalPrice}
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {((downPayment / totalPrice) * 100).toFixed(1)}% do valor total
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="years">Prazo (anos)</Label>
                    <Select value={years.toString()} onValueChange={(v) => setYears(parseInt(v))}>
                      <SelectTrigger id="years">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30, 35].map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y} anos ({y * 12} meses)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interestRate">Taxa de Juros (% a.a.)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="30"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(interestRate / 12).toFixed(2)}% ao mês
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSimulate} size="lg">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Simular Financiamento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            {simulationSAC && simulationPRICE && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Simulação</CardTitle>
                  <CardDescription>
                    Compare os sistemas de amortização SAC e PRICE
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="comparison" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="comparison">Comparação</TabsTrigger>
                      <TabsTrigger value="sac">SAC</TabsTrigger>
                      <TabsTrigger value="price">PRICE</TabsTrigger>
                    </TabsList>

                    <TabsContent value="comparison" className="mt-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* SAC */}
                        <div className="rounded-lg border p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Sistema SAC</h3>
                            <Badge variant="outline">
                              <TrendingDown className="mr-1 h-3 w-3" />
                              Decrescente
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Primeira Prestação</p>
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(simulationSAC.firstPayment)}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Última Prestação</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(simulationSAC.lastPayment)}
                              </p>
                            </div>

                            <Separator />

                            <div>
                              <p className="text-sm text-muted-foreground">Total de Juros</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(simulationSAC.totalInterest)}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Total Pago</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(simulationSAC.totalPaid)}
                              </p>
                            </div>

                            {preferences?.monthlyIncome && (
                              <>
                                <Separator />
                                <Alert variant={paymentToIncomeRatioSAC > 30 ? 'destructive' : 'default'}>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    Comprometimento: {paymentToIncomeRatioSAC.toFixed(1)}% da renda
                                  </AlertDescription>
                                </Alert>
                              </>
                            )}
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="rounded-lg border p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Tabela PRICE</h3>
                            <Badge variant="outline">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Constante
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Prestação Fixa</p>
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(simulationPRICE.firstPayment)}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Todas as Parcelas</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(simulationPRICE.firstPayment)}
                              </p>
                            </div>

                            <Separator />

                            <div>
                              <p className="text-sm text-muted-foreground">Total de Juros</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(simulationPRICE.totalInterest)}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground">Total Pago</p>
                              <p className="text-lg font-semibold">
                                {formatCurrency(simulationPRICE.totalPaid)}
                              </p>
                            </div>

                            {preferences?.monthlyIncome && (
                              <>
                                <Separator />
                                <Alert variant={paymentToIncomeRatioPRICE > 30 ? 'destructive' : 'default'}>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    Comprometimento: {paymentToIncomeRatioPRICE.toFixed(1)}% da renda
                                  </AlertDescription>
                                </Alert>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Análise Comparativa */}
                      <div className="mt-6 rounded-lg bg-muted p-6">
                        <h4 className="mb-4 font-semibold">Análise Comparativa</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Diferença nos juros totais:</span>
                            <span className="font-semibold">
                              {formatCurrency(Math.abs(simulationPRICE.totalInterest - simulationSAC.totalInterest))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sistema mais econômico:</span>
                            <span className="font-semibold text-green-600">
                              {simulationSAC.totalInterest < simulationPRICE.totalInterest ? 'SAC' : 'PRICE'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Economia total (SAC vs PRICE):</span>
                            <span className="font-semibold">
                              {formatCurrency(simulationPRICE.totalPaid - simulationSAC.totalPaid)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sac" className="mt-6">
                      <div className="rounded-lg border">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted">
                              <tr>
                                <th className="p-2 text-left">Mês</th>
                                <th className="p-2 text-right">Prestação</th>
                                <th className="p-2 text-right">Amortização</th>
                                <th className="p-2 text-right">Juros</th>
                                <th className="p-2 text-right">Saldo Devedor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {simulationSAC.schedule.map((row) => (
                                <tr key={row.month} className="border-t">
                                  <td className="p-2">{row.month}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.payment)}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.principal)}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.balance)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="price" className="mt-6">
                      <div className="rounded-lg border">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted">
                              <tr>
                                <th className="p-2 text-left">Mês</th>
                                <th className="p-2 text-right">Prestação</th>
                                <th className="p-2 text-right">Amortização</th>
                                <th className="p-2 text-right">Juros</th>
                                <th className="p-2 text-right">Saldo Devedor</th>
                              </tr>
                            </thead>
                            <tbody>
                              {simulationPRICE.schedule.map((row) => (
                                <tr key={row.month} className="border-t">
                                  <td className="p-2">{row.month}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.payment)}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.principal)}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                                  <td className="p-2 text-right">{formatCurrency(row.balance)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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

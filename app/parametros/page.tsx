'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import { usePreferences } from '@/hooks/usePreferences'
import { UserPreferences } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function ParametrosPage() {
  const { preferences, loading, updatePreferences } = usePreferences()
  const [formData, setFormData] = useState<Partial<UserPreferences>>({})

  useEffect(() => {
    if (preferences) {
      setFormData(preferences)
    }
  }, [preferences])

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const toNumberOrUndefined = (v: string) => (v === '' ? undefined : parseFloat(v))

  const handleSubmit = async () => {
    const success = await updatePreferences(formData)

    if (success) {
      toast.success('Parâmetros salvos com sucesso!')
    } else {
      toast.error('Erro ao salvar parâmetros')
    }
  }

  if (loading || !preferences) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">
            Parâmetros e Configurações
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure taxas padrão, pesos dos scores e suas preferências pessoais
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Taxas Padrão</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="defaultInterestRate">Taxa de Juros Padrão (% a.a.)</Label>
                <Input
                  id="defaultInterestRate"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.defaultInterestRate ?? preferences.defaultInterestRate}
                  onChange={(e) => handleChange('defaultInterestRate', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="defaultCET">CET Padrão (% a.a.)</Label>
                <Input
                  id="defaultCET"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.defaultCET ?? preferences.defaultCET}
                  onChange={(e) => handleChange('defaultCET', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="defaultVacancyRate">Taxa de Vacância Padrão (%)</Label>
                <Input
                  id="defaultVacancyRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.defaultVacancyRate ?? preferences.defaultVacancyRate}
                  onChange={(e) => handleChange('defaultVacancyRate', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="defaultMaintenancePercent">Manutenção Padrão (% do aluguel)</Label>
                <Input
                  id="defaultMaintenancePercent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.defaultMaintenancePercent ?? preferences.defaultMaintenancePercent}
                  onChange={(e) => handleChange('defaultMaintenancePercent', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="defaultAnnualAppreciation">Valorização Anual Padrão (%)</Label>
                <Input
                  id="defaultAnnualAppreciation"
                  type="number"
                  step="0.1"
                  min="-10"
                  max="20"
                  value={formData.defaultAnnualAppreciation ?? preferences.defaultAnnualAppreciation}
                  onChange={(e) => handleChange('defaultAnnualAppreciation', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="defaultRentIncreaseIndex">Índice de Reajuste de Aluguel</Label>
                <Input
                  id="defaultRentIncreaseIndex"
                  value={formData.defaultRentIncreaseIndex ?? preferences.defaultRentIncreaseIndex}
                  onChange={(e) => handleChange('defaultRentIncreaseIndex', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Orçamento e Renda</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  step="100"
                  min="0"
                  value={formData.monthlyIncome ?? preferences.monthlyIncome}
                  onChange={(e) => handleChange('monthlyIncome', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="monthlyBudget">Orçamento Mensal (R$)</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  step="100"
                  min="0"
                  value={formData.monthlyBudget ?? preferences.monthlyBudget}
                  onChange={(e) => handleChange('monthlyBudget', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="maxPaymentToIncomeRatio">Máx. Prestação/Renda (%)</Label>
                <Input
                  id="maxPaymentToIncomeRatio"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.maxPaymentToIncomeRatio ?? preferences.maxPaymentToIncomeRatio}
                  onChange={(e) => handleChange('maxPaymentToIncomeRatio', toNumberOrUndefined(e.target.value))}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Porcentagem máxima da renda comprometida com prestação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Impostos</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="itbiRate">Alíquota ITBI (%)</Label>
                <Input
                  id="itbiRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.itbiRate ?? preferences.itbiRate}
                  onChange={(e) => handleChange('itbiRate', toNumberOrUndefined(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="capitalGainsTaxRate">IR Ganho de Capital (%)</Label>
                <Input
                  id="capitalGainsTaxRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={formData.capitalGainsTaxRate ?? preferences.capitalGainsTaxRate}
                  onChange={(e) => handleChange('capitalGainsTaxRate', toNumberOrUndefined(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleSubmit} disabled={!preferences?.id}>
            Salvar Parâmetros
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

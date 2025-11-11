'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PropertyFormData, ConstructionPhase } from '@/types'

interface FinancialInfoStepProps {
  formData: Partial<PropertyFormData>
  onChange: (updates: Partial<PropertyFormData>) => void
  errors: Record<string, string>
}

const constructionPhases: { value: ConstructionPhase; label: string }[] = [
  { value: 'launch', label: 'Lançamento' },
  { value: 'foundation', label: 'Fundação' },
  { value: 'structure', label: 'Estrutura' },
  { value: 'finishing', label: 'Acabamento' },
  { value: 'delivered', label: 'Entregue' },
]

const correctionIndices = ['INCC', 'IGPM', 'IPCA', 'CDI', 'Fixo']

export default function FinancialInfoStep({ formData, onChange, errors }: FinancialInfoStepProps) {
  const handleChange = (field: string, value: any) => {
    if (field.startsWith('paymentPlan.')) {
      const planField = field.split('.')[1]
      onChange({
        paymentPlan: {
          ...formData.paymentPlan,
          [planField]: value,
        },
      })
    } else {
      onChange({ [field]: value })
    }
  }

  const isReady = formData.type === 'ready'

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Informações Financeiras</h2>

      <div className="space-y-6">
        {isReady ? (
          <>
            {/* Imóvel Pronto */}
            <div>
              <Label htmlFor="readyPrice">Valor Total Pedido (R$) *</Label>
              <Input
                id="readyPrice"
                type="number"
                step="1000"
                min="0"
                value={formData.readyPrice || ''}
                onChange={(e) => handleChange('readyPrice', parseFloat(e.target.value))}
                className={errors.readyPrice ? 'border-destructive' : ''}
              />
              {errors.readyPrice ? (
                <p className="mt-1 text-sm text-destructive">{errors.readyPrice}</p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Valor total do imóvel pronto</p>
              )}
            </div>

            <div>
              <Label htmlFor="negotiationNotes">Anotações de Negociação</Label>
              <textarea
                id="negotiationNotes"
                rows={3}
                value={formData.negotiationNotes || ''}
                onChange={(e) => handleChange('negotiationNotes', e.target.value)}
                placeholder="Ex: Margem de desconto, urgência do vendedor, condições especiais"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {formData.readyPrice && formData.privateArea && (
              <p className="text-sm text-muted-foreground">
                Preço/m²: R$ {(formData.readyPrice / formData.privateArea).toFixed(2)}
              </p>
            )}
          </>
        ) : (
          <>
            {/* Imóvel Na Planta */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="deliveryDate">Previsão de Entrega *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate ? new Date(formData.deliveryDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('deliveryDate', new Date(e.target.value))}
                  className={errors.deliveryDate ? 'border-destructive' : ''}
                />
                {errors.deliveryDate && <p className="mt-1 text-sm text-destructive">{errors.deliveryDate}</p>}
              </div>

              <div>
                <Label htmlFor="constructionPhase">Fase da Obra</Label>
                <Select
                  value={formData.constructionPhase || 'launch'}
                  onValueChange={(value) => handleChange('constructionPhase', value)}
                >
                  <SelectTrigger id="constructionPhase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {constructionPhases.map((phase) => (
                      <SelectItem key={phase.value} value={phase.value}>
                        {phase.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pricePerSqm">Preço/m² (R$) *</Label>
                <Input
                  id="pricePerSqm"
                  type="number"
                  step="100"
                  min="0"
                  value={formData.pricePerSqm || ''}
                  onChange={(e) => handleChange('pricePerSqm', parseFloat(e.target.value))}
                  className={errors.pricePerSqm ? 'border-destructive' : ''}
                />
                {errors.pricePerSqm ? (
                  <p className="mt-1 text-sm text-destructive">{errors.pricePerSqm}</p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Valor por metro quadrado</p>
                )}
              </div>

              <div>
                <Label htmlFor="correctionIndex">Índice de Correção</Label>
                <Select
                  value={formData.correctionIndex || 'INCC'}
                  onValueChange={(value) => handleChange('correctionIndex', value)}
                >
                  <SelectTrigger id="correctionIndex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {correctionIndices.map((index) => (
                      <SelectItem key={index} value={index}>
                        {index}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.pricePerSqm && formData.privateArea && (
              <p className="text-sm text-muted-foreground">
                Valor Total Estimado: R$ {(formData.pricePerSqm * formData.privateArea).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}

            <Separator className="my-6" />

            <div>
              <h3 className="mb-2 text-sm font-medium">Plano de Pagamento (Opcional)</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Você pode adicionar estas informações depois
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="downPayment">Sinal (R$)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    step="1000"
                    min="0"
                    value={formData.paymentPlan?.downPayment || ''}
                    onChange={(e) => handleChange('paymentPlan.downPayment', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="installmentValue">Parcelas até Entrega - Valor (R$)</Label>
                  <Input
                    id="installmentValue"
                    type="number"
                    step="100"
                    min="0"
                    value={formData.paymentPlan?.installments?.value || ''}
                    onChange={(e) => {
                      handleChange('paymentPlan', {
                        ...formData.paymentPlan,
                        installments: {
                          ...formData.paymentPlan?.installments,
                          value: parseFloat(e.target.value),
                        },
                      })
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="installmentQuantity">Parcelas até Entrega - Quantidade</Label>
                  <Input
                    id="installmentQuantity"
                    type="number"
                    min="0"
                    value={formData.paymentPlan?.installments?.quantity || ''}
                    onChange={(e) => {
                      handleChange('paymentPlan', {
                        ...formData.paymentPlan,
                        installments: {
                          ...formData.paymentPlan?.installments,
                          quantity: parseInt(e.target.value),
                        },
                      })
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="balanceAtDelivery">Saldo nas Chaves (R$)</Label>
                  <Input
                    id="balanceAtDelivery"
                    type="number"
                    step="1000"
                    min="0"
                    value={formData.paymentPlan?.balanceAtDelivery || ''}
                    onChange={(e) => handleChange('paymentPlan.balanceAtDelivery', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="paymentPlanObservations">Observações do Plano</Label>
                <textarea
                  id="paymentPlanObservations"
                  rows={2}
                  value={formData.paymentPlan?.observations || ''}
                  onChange={(e) => handleChange('paymentPlan.observations', e.target.value)}
                  placeholder="Ex: Balões, intermediárias, descontos"
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

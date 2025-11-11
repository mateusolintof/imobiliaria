'use client'

import {
  Box,
  TextField,
  Grid,
  Typography,
  MenuItem,
  Divider,
} from '@mui/material'
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
    <Box>
      <Typography variant="h6" gutterBottom>
        Informações Financeiras
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {isReady ? (
          <>
            {/* Imóvel Pronto */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor Total Pedido (R$)"
                type="number"
                value={formData.readyPrice || ''}
                onChange={(e) => handleChange('readyPrice', parseFloat(e.target.value))}
                error={!!errors.readyPrice}
                helperText={errors.readyPrice || 'Valor total do imóvel pronto'}
                required
                InputProps={{ inputProps: { min: 0, step: 1000 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Anotações de Negociação"
                multiline
                rows={3}
                value={formData.negotiationNotes || ''}
                onChange={(e) => handleChange('negotiationNotes', e.target.value)}
                placeholder="Ex: Margem de desconto, urgência do vendedor, condições especiais"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Preço/m²: {formData.readyPrice && formData.privateArea
                  ? `R$ ${(formData.readyPrice / formData.privateArea).toFixed(2)}`
                  : '—'}
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            {/* Imóvel Na Planta */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Previsão de Entrega"
                type="date"
                value={formData.deliveryDate ? new Date(formData.deliveryDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('deliveryDate', new Date(e.target.value))}
                error={!!errors.deliveryDate}
                helperText={errors.deliveryDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fase da Obra"
                value={formData.constructionPhase || 'launch'}
                onChange={(e) => handleChange('constructionPhase', e.target.value)}
                select
              >
                {constructionPhases.map((phase) => (
                  <MenuItem key={phase.value} value={phase.value}>
                    {phase.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço/m² (R$)"
                type="number"
                value={formData.pricePerSqm || ''}
                onChange={(e) => handleChange('pricePerSqm', parseFloat(e.target.value))}
                error={!!errors.pricePerSqm}
                helperText={errors.pricePerSqm || 'Valor por metro quadrado'}
                required
                InputProps={{ inputProps: { min: 0, step: 100 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Índice de Correção"
                value={formData.correctionIndex || 'INCC'}
                onChange={(e) => handleChange('correctionIndex', e.target.value)}
                select
              >
                {correctionIndices.map((index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Valor Total Estimado: {formData.pricePerSqm && formData.privateArea
                  ? `R$ ${(formData.pricePerSqm * formData.privateArea).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : '—'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Plano de Pagamento (Opcional)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Você pode adicionar estas informações depois
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sinal (R$)"
                type="number"
                value={formData.paymentPlan?.downPayment || ''}
                onChange={(e) => handleChange('paymentPlan.downPayment', parseFloat(e.target.value))}
                InputProps={{ inputProps: { min: 0, step: 1000 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parcelas até Entrega - Valor (R$)"
                type="number"
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
                InputProps={{ inputProps: { min: 0, step: 100 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parcelas até Entrega - Quantidade"
                type="number"
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
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Saldo nas Chaves (R$)"
                type="number"
                value={formData.paymentPlan?.balanceAtDelivery || ''}
                onChange={(e) => handleChange('paymentPlan.balanceAtDelivery', parseFloat(e.target.value))}
                InputProps={{ inputProps: { min: 0, step: 1000 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações do Plano"
                multiline
                rows={2}
                value={formData.paymentPlan?.observations || ''}
                onChange={(e) => handleChange('paymentPlan.observations', e.target.value)}
                placeholder="Ex: Balões, intermediárias, descontos"
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

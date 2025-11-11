'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material'
import MainLayout from '@/components/MainLayout'
import { usePreferences } from '@/hooks/usePreferences'
import { UserPreferences } from '@/types'

export default function ParametrosPage() {
  const { preferences, loading, updatePreferences } = usePreferences()
  const [formData, setFormData] = useState<Partial<UserPreferences>>({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  useEffect(() => {
    if (preferences) {
      setFormData(preferences)
    }
  }, [preferences])

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const success = await updatePreferences(formData)

    setSnackbar({
      open: true,
      message: success ? 'Parâmetros salvos com sucesso!' : 'Erro ao salvar parâmetros',
      severity: success ? 'success' : 'error',
    })
  }

  if (loading || !preferences) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Parâmetros e Configurações
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure taxas padrão, pesos dos scores e suas preferências pessoais
          </Typography>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Taxas Padrão
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taxa de Juros Padrão (% a.a.)"
                  type="number"
                  value={formData.defaultInterestRate || preferences.defaultInterestRate}
                  onChange={(e) => handleChange('defaultInterestRate', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CET Padrão (% a.a.)"
                  type="number"
                  value={formData.defaultCET || preferences.defaultCET}
                  onChange={(e) => handleChange('defaultCET', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taxa de Vacância Padrão (%)"
                  type="number"
                  value={formData.defaultVacancyRate || preferences.defaultVacancyRate}
                  onChange={(e) => handleChange('defaultVacancyRate', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manutenção Padrão (% do aluguel)"
                  type="number"
                  value={formData.defaultMaintenancePercent || preferences.defaultMaintenancePercent}
                  onChange={(e) => handleChange('defaultMaintenancePercent', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valorização Anual Padrão (%)"
                  type="number"
                  value={formData.defaultAnnualAppreciation || preferences.defaultAnnualAppreciation}
                  onChange={(e) => handleChange('defaultAnnualAppreciation', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: -10, max: 20, step: 0.1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Índice de Reajuste de Aluguel"
                  value={formData.defaultRentIncreaseIndex || preferences.defaultRentIncreaseIndex}
                  onChange={(e) => handleChange('defaultRentIncreaseIndex', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Orçamento e Renda
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Renda Mensal (R$)"
                  type="number"
                  value={formData.monthlyIncome || preferences.monthlyIncome}
                  onChange={(e) => handleChange('monthlyIncome', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, step: 100 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Orçamento Mensal (R$)"
                  type="number"
                  value={formData.monthlyBudget || preferences.monthlyBudget}
                  onChange={(e) => handleChange('monthlyBudget', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, step: 100 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Máx. Prestação/Renda (%)"
                  type="number"
                  value={formData.maxPaymentToIncomeRatio || preferences.maxPaymentToIncomeRatio}
                  onChange={(e) => handleChange('maxPaymentToIncomeRatio', parseFloat(e.target.value))}
                  helperText="Porcentagem máxima da renda comprometida com prestação"
                  InputProps={{ inputProps: { min: 0, max: 100, step: 1 } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Impostos
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alíquota ITBI (%)"
                  type="number"
                  value={formData.itbiRate || preferences.itbiRate}
                  onChange={(e) => handleChange('itbiRate', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="IR Ganho de Capital (%)"
                  type="number"
                  value={formData.capitalGainsTaxRate || preferences.capitalGainsTaxRate}
                  onChange={(e) => handleChange('capitalGainsTaxRate', parseFloat(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 30, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Salvar Parâmetros
            </Button>
          </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </MainLayout>
  )
}

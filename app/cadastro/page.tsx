'use client'

import { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  Snackbar,
} from '@mui/material'
import MainLayout from '@/components/MainLayout'
import PropertyTypeStep from '@/components/cadastro/PropertyTypeStep'
import BasicInfoStep from '@/components/cadastro/BasicInfoStep'
import FinancialInfoStep from '@/components/cadastro/FinancialInfoStep'
import { PropertyFormData, PropertyType } from '@/types'
import { useProperties } from '@/hooks/useProperties'
import { useRouter } from 'next/navigation'

const steps = ['Tipo de Imóvel', 'Informações Básicas', 'Dados Financeiros']

const initialFormData: Partial<PropertyFormData> = {
  name: '',
  type: 'ready',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  },
  privateArea: 0,
  bedrooms: 0,
  suites: 0,
  parkingSpots: 0,
  bathrooms: 0,
  condoFee: 0,
  iptu: 0,
  amenities: [],
  tags: [],
  isFavorite: false,
  visited: false,
}

export default function CadastroPage() {
  const router = useRouter()
  const { addProperty } = useProperties()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<Partial<PropertyFormData>>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!formData.type) newErrors.type = 'Selecione o tipo de imóvel'
    }

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Nome é obrigatório'
      if (!formData.privateArea || formData.privateArea <= 0) newErrors.privateArea = 'Metragem inválida'
      if (!formData.address?.street) newErrors['address.street'] = 'Endereço é obrigatório'
      if (!formData.address?.neighborhood) newErrors['address.neighborhood'] = 'Bairro é obrigatório'
      if (!formData.address?.city) newErrors['address.city'] = 'Cidade é obrigatória'
      if (!formData.address?.state) newErrors['address.state'] = 'Estado é obrigatório'
    }

    if (step === 2) {
      if (formData.type === 'ready') {
        if (!formData.readyPrice || formData.readyPrice <= 0) {
          newErrors.readyPrice = 'Preço é obrigatório'
        }
      } else {
        if (!formData.deliveryDate) newErrors.deliveryDate = 'Data de entrega é obrigatória'
        if (!formData.pricePerSqm || formData.pricePerSqm <= 0) {
          newErrors.pricePerSqm = 'Preço/m² é obrigatório'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return

    try {
      const property = await addProperty(formData as PropertyFormData)

      if (property) {
        setSnackbar({
          open: true,
          message: 'Imóvel cadastrado com sucesso!',
          severity: 'success',
        })

        // Reset form and redirect after a delay
        setTimeout(() => {
          setFormData(initialFormData)
          setActiveStep(0)
          router.push('/meus-imoveis')
        }, 1500)
      } else {
        throw new Error('Erro ao cadastrar imóvel')
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Erro ao cadastrar imóvel',
        severity: 'error',
      })
    }
  }

  const updateFormData = (updates: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PropertyTypeStep
            type={formData.type as PropertyType}
            onChange={(type) => updateFormData({ type })}
            error={errors.type}
          />
        )
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onChange={updateFormData}
            errors={errors}
          />
        )
      case 2:
        return (
          <FinancialInfoStep
            formData={formData}
            onChange={updateFormData}
            errors={errors}
          />
        )
      default:
        return null
    }
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Cadastrar Imóvel
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Preencha as informações do imóvel para adicioná-lo ao seu portfólio
          </Typography>

          <Stepper activeStep={activeStep} sx={{ my: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4 }}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Voltar
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Cadastrar Imóvel
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              )}
            </Box>
          </Box>
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
      </Container>
    </MainLayout>
  )
}

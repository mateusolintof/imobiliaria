'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import PropertyTypeStep from '@/components/cadastro/PropertyTypeStep'
import BasicInfoStep from '@/components/cadastro/BasicInfoStep'
import FinancialInfoStep from '@/components/cadastro/FinancialInfoStep'
import { Button } from '@/components/ui/button'
import { PropertyFormData, PropertyType } from '@/types'
import { useProperties } from '@/hooks/useProperties'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

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
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const { addProperty, updateProperty, getPropertyById } = useProperties()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<Partial<PropertyFormData>>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Carregar dados do imóvel quando em modo de edição
  useEffect(() => {
    if (editId) {
      loadProperty(editId)
    }
  }, [editId])

  const loadProperty = async (id: string) => {
    setLoading(true)
    const property = await getPropertyById(id)
    if (property) {
      setFormData(property)
    } else {
      toast.error('Imóvel não encontrado')
      router.push('/cadastro')
    }
    setLoading(false)
  }

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
      let success = false

      if (editId) {
        // Modo de edição
        success = await updateProperty(editId, formData as PropertyFormData)
        if (success) {
          toast.success('Imóvel atualizado com sucesso!')
        } else {
          throw new Error('Erro ao atualizar imóvel')
        }
      } else {
        // Modo de criação
        const property = await addProperty(formData as PropertyFormData)
        success = !!property
        if (success) {
          toast.success('Imóvel cadastrado com sucesso!')
        } else {
          throw new Error('Erro ao cadastrar imóvel')
        }
      }

      if (success) {
        // Reset form and redirect after a delay
        setTimeout(() => {
          setFormData(initialFormData)
          setActiveStep(0)
          router.push('/meus-imoveis')
        }, 1500)
      }
    } catch (error: any) {
      toast.error(error.message || (editId ? 'Erro ao atualizar imóvel' : 'Erro ao cadastrar imóvel'))
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

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Carregando dados do imóvel...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">
            {editId ? 'Editar Imóvel' : 'Cadastrar Imóvel'}
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            {editId
              ? 'Atualize as informações do imóvel'
              : 'Preencha as informações do imóvel para adicioná-lo ao seu portfólio'}
          </p>

          {/* Custom Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((label, index) => (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold',
                        index < activeStep
                          ? 'border-primary bg-primary text-primary-foreground'
                          : index === activeStep
                          ? 'border-primary bg-background text-primary'
                          : 'border-muted bg-background text-muted-foreground'
                      )}
                    >
                      {index < activeStep ? <Check className="h-5 w-5" /> : index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          index <= activeStep ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {label}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'mx-4 h-[2px] flex-1',
                        index < activeStep ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStepContent(activeStep)}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Voltar
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>
                {editId ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
              </Button>
            ) : (
              <Button onClick={handleNext}>Próximo</Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

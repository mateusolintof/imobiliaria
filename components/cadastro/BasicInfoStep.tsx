'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PropertyFormData } from '@/types'

interface BasicInfoStepProps {
  formData: Partial<PropertyFormData>
  onChange: (updates: Partial<PropertyFormData>) => void
  errors: Record<string, string>
}

export default function BasicInfoStep({ formData, onChange, errors }: BasicInfoStepProps) {
  const handleChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      onChange({
        address: {
          ...formData.address!,
          [addressField]: value,
        },
      })
    } else {
      onChange({ [field]: value })
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Informações Básicas</h2>

      <div className="space-y-6">
        {/* Nome do empreendimento */}
        <div>
          <Label htmlFor="name">Nome do Empreendimento / Edifício *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Endereço */}
        <div>
          <h3 className="mb-4 text-sm font-medium">Endereço</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <div className="sm:col-span-8">
              <Label htmlFor="street">Rua/Avenida *</Label>
              <Input
                id="street"
                value={formData.address?.street || ''}
                onChange={(e) => handleChange('address.street', e.target.value)}
                className={errors['address.street'] ? 'border-destructive' : ''}
              />
              {errors['address.street'] && <p className="mt-1 text-sm text-destructive">{errors['address.street']}</p>}
            </div>

            <div className="sm:col-span-4">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={formData.address?.number || ''}
                onChange={(e) => handleChange('address.number', e.target.value)}
              />
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.address?.complement || ''}
                onChange={(e) => handleChange('address.complement', e.target.value)}
              />
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={formData.address?.neighborhood || ''}
                onChange={(e) => handleChange('address.neighborhood', e.target.value)}
                className={errors['address.neighborhood'] ? 'border-destructive' : ''}
              />
              {errors['address.neighborhood'] && <p className="mt-1 text-sm text-destructive">{errors['address.neighborhood']}</p>}
            </div>

            <div className="sm:col-span-8">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.address?.city || ''}
                onChange={(e) => handleChange('address.city', e.target.value)}
                className={errors['address.city'] ? 'border-destructive' : ''}
              />
              {errors['address.city'] && <p className="mt-1 text-sm text-destructive">{errors['address.city']}</p>}
            </div>

            <div className="sm:col-span-4">
              <Label htmlFor="state">Estado *</Label>
              <Select value={formData.address?.state || ''} onValueChange={(value) => handleChange('address.state', value)}>
                <SelectTrigger id="state" className={errors['address.state'] ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE', 'DF', 'GO', 'MT', 'MS', 'PA', 'AM', 'RO', 'AC', 'RR', 'AP', 'TO', 'MA', 'PI', 'RN', 'PB', 'AL', 'SE'].map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors['address.state'] && <p className="mt-1 text-sm text-destructive">{errors['address.state']}</p>}
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.address?.zipCode || ''}
                onChange={(e) => handleChange('address.zipCode', e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        {/* Características */}
        <div>
          <h3 className="mb-4 text-sm font-medium">Características</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label htmlFor="privateArea">Área Privativa (m²) *</Label>
              <Input
                id="privateArea"
                type="number"
                step="0.01"
                min="0"
                value={formData.privateArea || ''}
                onChange={(e) => handleChange('privateArea', parseFloat(e.target.value))}
                className={errors.privateArea ? 'border-destructive' : ''}
              />
              {errors.privateArea && <p className="mt-1 text-sm text-destructive">{errors.privateArea}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="bedrooms">Dormitórios</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms || 0}
                onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="suites">Suítes</Label>
              <Input
                id="suites"
                type="number"
                min="0"
                value={formData.suites || 0}
                onChange={(e) => handleChange('suites', parseInt(e.target.value))}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="parkingSpots">Vagas</Label>
              <Input
                id="parkingSpots"
                type="number"
                min="0"
                value={formData.parkingSpots || 0}
                onChange={(e) => handleChange('parkingSpots', parseInt(e.target.value))}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms || 0}
                onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="floor">Andar</Label>
              <Input
                id="floor"
                type="number"
                min="0"
                value={formData.floor || ''}
                onChange={(e) => handleChange('floor', parseInt(e.target.value))}
              />
            </div>

            {formData.type === 'ready' && (
              <div className="sm:col-span-2">
                <Label htmlFor="yearBuilt">Ano de Construção</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearBuilt || ''}
                  onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>

        {/* Custos mensais */}
        <div>
          <h3 className="mb-4 text-sm font-medium">Custos Mensais/Anuais</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="condoFee">Condomínio (R$/mês)</Label>
              <Input
                id="condoFee"
                type="number"
                step="0.01"
                min="0"
                value={formData.condoFee || 0}
                onChange={(e) => handleChange('condoFee', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="iptu">IPTU (R$/ano)</Label>
              <Input
                id="iptu"
                type="number"
                step="0.01"
                min="0"
                value={formData.iptu || 0}
                onChange={(e) => handleChange('iptu', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div>
          <Label htmlFor="notes">Observações</Label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Ex: Vista para o mar, pet friendly, varanda gourmet, etc."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}

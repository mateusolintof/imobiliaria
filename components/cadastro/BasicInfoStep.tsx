'use client'

import {
  Box,
  TextField,
  Grid,
  Typography,
  MenuItem,
} from '@mui/material'
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
    <Box>
      <Typography variant="h6" gutterBottom>
        Informações Básicas
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Nome do empreendimento */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome do Empreendimento / Edifício"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Endereço
          </Typography>
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Rua/Avenida"
            value={formData.address?.street || ''}
            onChange={(e) => handleChange('address.street', e.target.value)}
            error={!!errors['address.street']}
            helperText={errors['address.street']}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Número"
            value={formData.address?.number || ''}
            onChange={(e) => handleChange('address.number', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Complemento"
            value={formData.address?.complement || ''}
            onChange={(e) => handleChange('address.complement', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bairro"
            value={formData.address?.neighborhood || ''}
            onChange={(e) => handleChange('address.neighborhood', e.target.value)}
            error={!!errors['address.neighborhood']}
            helperText={errors['address.neighborhood']}
            required
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Cidade"
            value={formData.address?.city || ''}
            onChange={(e) => handleChange('address.city', e.target.value)}
            error={!!errors['address.city']}
            helperText={errors['address.city']}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Estado"
            value={formData.address?.state || ''}
            onChange={(e) => handleChange('address.state', e.target.value)}
            error={!!errors['address.state']}
            helperText={errors['address.state']}
            select
            required
          >
            {['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE', 'DF', 'GO', 'MT', 'MS', 'PA', 'AM', 'RO', 'AC', 'RR', 'AP', 'TO', 'MA', 'PI', 'RN', 'PB', 'AL', 'SE'].map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CEP"
            value={formData.address?.zipCode || ''}
            onChange={(e) => handleChange('address.zipCode', e.target.value)}
            placeholder="00000-000"
          />
        </Grid>

        {/* Características */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Características
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Área Privativa (m²)"
            type="number"
            value={formData.privateArea || ''}
            onChange={(e) => handleChange('privateArea', parseFloat(e.target.value))}
            error={!!errors.privateArea}
            helperText={errors.privateArea}
            required
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Dormitórios"
            type="number"
            value={formData.bedrooms || 0}
            onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Suítes"
            type="number"
            value={formData.suites || 0}
            onChange={(e) => handleChange('suites', parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Vagas"
            type="number"
            value={formData.parkingSpots || 0}
            onChange={(e) => handleChange('parkingSpots', parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Banheiros"
            type="number"
            value={formData.bathrooms || 0}
            onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            fullWidth
            label="Andar"
            type="number"
            value={formData.floor || ''}
            onChange={(e) => handleChange('floor', parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        {formData.type === 'ready' && (
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Ano de Construção"
              type="number"
              value={formData.yearBuilt || ''}
              onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
            />
          </Grid>
        )}

        {/* Custos mensais */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Custos Mensais/Anuais
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Condomínio (R$/mês)"
            type="number"
            value={formData.condoFee || 0}
            onChange={(e) => handleChange('condoFee', parseFloat(e.target.value))}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="IPTU (R$/ano)"
            type="number"
            value={formData.iptu || 0}
            onChange={(e) => handleChange('iptu', parseFloat(e.target.value))}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
        </Grid>

        {/* Notas */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Observações"
            multiline
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Ex: Vista para o mar, pet friendly, varanda gourmet, etc."
          />
        </Grid>
      </Grid>
    </Box>
  )
}

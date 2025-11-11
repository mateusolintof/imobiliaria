'use client'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  FormHelperText,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ConstructionIcon from '@mui/icons-material/Construction'
import { PropertyType } from '@/types'

interface PropertyTypeStepProps {
  type: PropertyType
  onChange: (type: PropertyType) => void
  error?: string
}

export default function PropertyTypeStep({ type, onChange, error }: PropertyTypeStepProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Selecione o tipo de imóvel
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Escolha se o imóvel está pronto ou na planta
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card
            variant={type === 'ready' ? 'outlined' : 'elevation'}
            sx={{
              border: type === 'ready' ? 2 : 1,
              borderColor: type === 'ready' ? 'primary.main' : 'divider',
              height: '100%',
            }}
          >
            <CardActionArea onClick={() => onChange('ready')} sx={{ height: '100%', p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <HomeIcon
                  sx={{
                    fontSize: 64,
                    color: type === 'ready' ? 'primary.main' : 'text.secondary',
                    mb: 2,
                  }}
                />
                <Typography variant="h5" component="div" gutterBottom>
                  Imóvel Pronto
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Imóvel já construído e disponível para compra imediata
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card
            variant={type === 'under_construction' ? 'outlined' : 'elevation'}
            sx={{
              border: type === 'under_construction' ? 2 : 1,
              borderColor: type === 'under_construction' ? 'primary.main' : 'divider',
              height: '100%',
            }}
          >
            <CardActionArea onClick={() => onChange('under_construction')} sx={{ height: '100%', p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ConstructionIcon
                  sx={{
                    fontSize: 64,
                    color: type === 'under_construction' ? 'primary.main' : 'text.secondary',
                    mb: 2,
                  }}
                />
                <Typography variant="h5" component="div" gutterBottom>
                  Na Planta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Imóvel em construção com previsão de entrega futura
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <FormHelperText error sx={{ mt: 2 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  )
}

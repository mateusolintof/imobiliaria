'use client'

import { Container, Box, Typography } from '@mui/material'
import MainLayout from '@/components/MainLayout'

export default function InvestimentoPage() {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Análise de Investimento
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calcule rentabilidade, Cap Rate, IRR e analise riscos de investimento imobiliário.
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            Em desenvolvimento...
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  )
}

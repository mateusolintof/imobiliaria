'use client'

import { Container, Box, Typography } from '@mui/material'
import MainLayout from '@/components/MainLayout'

export default function CompararPage() {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Comparar Imóveis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compare múltiplos imóveis lado a lado e analise trade-offs.
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            Em desenvolvimento...
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  )
}

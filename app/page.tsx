'use client'

import { Container, Box, Typography } from '@mui/material'
import MainLayout from '@/components/MainLayout'

export default function HomePage() {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Bem-vindo à Plataforma de Análise Imobiliária
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Organize seus imóveis, simule cenários financeiros e tome decisões mais informadas.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use a navegação acima para começar:
          </Typography>
          <Box component="ul" sx={{ mt: 2 }}>
            <li>
              <Typography variant="body2">
                <strong>Cadastro:</strong> Adicione imóveis ao seu portfólio
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Meus Imóveis:</strong> Gerencie e organize seus imóveis
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Moradia:</strong> Simule financiamentos e custos de moradia
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Investimento:</strong> Analise rentabilidade e riscos
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Comparar:</strong> Compare múltiplos imóveis lado a lado
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Parâmetros:</strong> Configure suas preferências
              </Typography>
            </li>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  )
}

'use client'

import { useState, useMemo } from 'react'
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import MainLayout from '@/components/MainLayout'
import PropertyCard from '@/components/PropertyCard'
import { useProperties } from '@/hooks/useProperties'
import { Property, PropertyType } from '@/types'
import { useRouter } from 'next/navigation'

export default function MeusImoveisPage() {
  const router = useRouter()
  const { properties, loading, error } = useProperties()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'area'>('newest')

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((prop) =>
        prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((prop) => prop.type === typeFilter)
    }

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price':
          const priceA = a.type === 'ready' ? (a.readyPrice || 0) : (a.pricePerSqm || 0) * a.privateArea
          const priceB = b.type === 'ready' ? (b.readyPrice || 0) : (b.pricePerSqm || 0) * b.privateArea
          return priceB - priceA
        case 'area':
          return b.privateArea - a.privateArea
        default:
          return 0
      }
    })

    return sorted
  }, [properties, searchTerm, typeFilter, sortBy])

  if (loading) {
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
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Meus Imóveis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? 'imóvel' : 'imóveis'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/cadastro')}
            >
              Adicionar Imóvel
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filtros */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nome, bairro ou cidade"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Tipo"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'all')}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="ready">Pronto</MenuItem>
                  <MenuItem value="under_construction">Na Planta</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={3} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Ordenar por"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'price' | 'area')}
                >
                  <MenuItem value="newest">Mais Recentes</MenuItem>
                  <MenuItem value="price">Maior Preço</MenuItem>
                  <MenuItem value="area">Maior Área</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Lista de Imóveis */}
          {filteredAndSortedProperties.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {properties.length === 0 ? 'Nenhum imóvel cadastrado' : 'Nenhum imóvel encontrado'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {properties.length === 0
                  ? 'Comece adicionando seu primeiro imóvel ao portfólio'
                  : 'Tente ajustar os filtros de busca'}
              </Typography>
              {properties.length === 0 && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/cadastro')}
                  sx={{ mt: 2 }}
                >
                  Adicionar Primeiro Imóvel
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredAndSortedProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </MainLayout>
  )
}

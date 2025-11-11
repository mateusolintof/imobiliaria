'use client'

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ConstructionIcon from '@mui/icons-material/Construction'
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Property } from '@/types'
import { formatCurrency, formatArea, formatDate } from '@/utils/helpers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const totalPrice = property.type === 'ready'
    ? property.readyPrice || 0
    : (property.pricePerSqm || 0) * property.privateArea

  const pricePerSqm = property.type === 'ready' && property.readyPrice
    ? property.readyPrice / property.privateArea
    : property.pricePerSqm || 0

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header com ícone e menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {property.type === 'ready' ? (
              <HomeIcon color="primary" />
            ) : (
              <ConstructionIcon color="secondary" />
            )}
            <Chip
              label={property.type === 'ready' ? 'Pronto' : 'Na Planta'}
              size="small"
              color={property.type === 'ready' ? 'primary' : 'secondary'}
              variant="outlined"
            />
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              router.push(`/moradia?propertyId=${property.id}`)
              handleMenuClose()
            }}>
              Simular Moradia
            </MenuItem>
            <MenuItem onClick={() => {
              router.push(`/investimento?propertyId=${property.id}`)
              handleMenuClose()
            }}>
              Análise de Investimento
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              Excluir
            </MenuItem>
          </Menu>
        </Box>

        {/* Nome */}
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {property.name}
        </Typography>

        {/* Localização */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {property.address.neighborhood}, {property.address.city} - {property.address.state}
        </Typography>

        {/* Preço */}
        <Typography variant="h5" color="primary" sx={{ mt: 2, mb: 1 }}>
          {formatCurrency(totalPrice)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatCurrency(pricePerSqm)}/m²
        </Typography>

        {/* Características */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SquareFootIcon fontSize="small" color="action" />
            <Typography variant="body2">{formatArea(property.privateArea)}</Typography>
          </Box>

          {property.bedrooms > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BedIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
              </Typography>
            </Box>
          )}

          {property.bathrooms > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BathtubIcon fontSize="small" color="action" />
              <Typography variant="body2">{property.bathrooms}</Typography>
            </Box>
          )}

          {property.parkingSpots > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DirectionsCarIcon fontSize="small" color="action" />
              <Typography variant="body2">{property.parkingSpots}</Typography>
            </Box>
          )}
        </Box>

        {/* Info adicional para na planta */}
        {property.type === 'under_construction' && property.deliveryDate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Entrega prevista: {formatDate(property.deliveryDate, 'MM/yyyy')}
            </Typography>
          </Box>
        )}

        {/* Custos mensais */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {property.condoFee > 0 && (
            <Typography variant="caption" color="text.secondary">
              Cond: {formatCurrency(property.condoFee)}/mês
            </Typography>
          )}
          {property.iptu > 0 && (
            <Typography variant="caption" color="text.secondary">
              IPTU: {formatCurrency(property.iptu)}/ano
            </Typography>
          )}
        </Box>

        {/* Tags */}
        {property.tags && property.tags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {property.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
            {property.tags.length > 3 && (
              <Chip label={`+${property.tags.length - 3}`} size="small" variant="outlined" />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <IconButton size="small" color={property.isFavorite ? 'error' : 'default'}>
          {property.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        {property.visited && (
          <Chip label="Visitado" size="small" color="success" variant="outlined" />
        )}
      </CardActions>
    </Card>
  )
}

'use client'

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Home,
  HardHat,
  Bed,
  Bath,
  Car,
  Ruler,
  MoreVertical,
  Heart,
} from 'lucide-react'
import { Property } from '@/types'
import { formatCurrency, formatArea, formatDate } from '@/utils/helpers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useProperties } from '@/hooks/useProperties'
import { toast } from 'sonner'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const { deleteProperty, toggleFavorite, toggleVisited } = useProperties()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const totalPrice = property.type === 'ready'
    ? property.readyPrice || 0
    : (property.pricePerSqm || 0) * property.privateArea

  const pricePerSqm = property.type === 'ready' && property.readyPrice
    ? property.readyPrice / property.privateArea
    : property.pricePerSqm || 0

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteProperty(property.id)

    if (success) {
      toast.success('Imóvel excluído com sucesso!')
      setDeleteDialogOpen(false)
    } else {
      toast.error('Erro ao excluir imóvel')
    }
    setIsDeleting(false)
  }

  const handleToggleFavorite = async () => {
    const success = await toggleFavorite(property.id, property.isFavorite)
    if (success) {
      toast.success(property.isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
    } else {
      toast.error('Erro ao atualizar favorito')
    }
  }

  const handleToggleVisited = async () => {
    const success = await toggleVisited(property.id, property.visited)
    if (success) {
      toast.success(property.visited ? 'Marcado como não visitado' : 'Marcado como visitado')
    } else {
      toast.error('Erro ao atualizar status de visita')
    }
  }

  return (
    <>
      <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
        <CardContent className="flex-grow p-4">
          {/* Header com ícone e menu */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              {property.type === 'ready' ? (
                <Home className="h-5 w-5 text-primary" />
              ) : (
                <HardHat className="h-5 w-5 text-secondary" />
              )}
              <Badge variant={property.type === 'ready' ? 'default' : 'secondary'}>
                {property.type === 'ready' ? 'Pronto' : 'Na Planta'}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/moradia?propertyId=${property.id}`)}>
                  Simular Moradia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/investimento?propertyId=${property.id}`)}>
                  Análise de Investimento
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/cadastro?edit=${property.id}`)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleVisited}>
                  {property.visited ? 'Marcar como não visitado' : 'Marcar como visitado'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Nome */}
          <h2 className="mb-2 truncate text-lg font-semibold">
            {property.name}
          </h2>

          {/* Localização */}
          <p className="mb-4 text-sm text-muted-foreground">
            {property.address.neighborhood}, {property.address.city} - {property.address.state}
          </p>

          {/* Preço */}
          <div className="mb-4">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(pricePerSqm)}/m²
            </p>
          </div>

          {/* Características */}
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatArea(property.privateArea)}</span>
            </div>

            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
                </span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}

            {property.parkingSpots > 0 && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{property.parkingSpots}</span>
              </div>
            )}
          </div>

          {/* Info adicional para na planta */}
          {property.type === 'under_construction' && property.deliveryDate && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground">
                Entrega prevista: {formatDate(property.deliveryDate, 'MM/yyyy')}
              </p>
            </div>
          )}

          {/* Custos mensais */}
          <div className="mb-4 flex gap-3">
            {property.condoFee > 0 && (
              <p className="text-xs text-muted-foreground">
                Cond: {formatCurrency(property.condoFee)}/mês
              </p>
            )}
            {property.iptu > 0 && (
              <p className="text-xs text-muted-foreground">
                IPTU: {formatCurrency(property.iptu)}/ano
              </p>
            )}
          </div>

          {/* Tags */}
          {property.tags && property.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {property.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center gap-2 px-4 pb-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', property.isFavorite && 'text-destructive')}
            onClick={handleToggleFavorite}
          >
            <Heart className={cn('h-4 w-4', property.isFavorite && 'fill-current')} />
          </Button>

          {property.visited && (
            <Badge variant="outline" className="border-green-600 text-green-600">
              Visitado
            </Badge>
          )}
        </CardFooter>
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o imóvel <strong>{property.name}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

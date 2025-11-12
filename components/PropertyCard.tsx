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
  Image as ImageIcon,
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

  // Obter imagem de capa (primeira imagem ou placeholder)
  const coverImage = property.images?.[0]

  return (
    <>
      <Card className="group flex h-full flex-col overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
        {/* Imagem de capa */}
        {coverImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <img
              src={coverImage}
              alt={property.name}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Image counter */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <ImageIcon className="h-3 w-3" />
                {property.images.length}
              </div>
            )}

            {/* Favorite button overlay */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute left-3 top-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110',
                property.isFavorite && 'bg-destructive text-white hover:bg-destructive/90'
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleToggleFavorite()
              }}
            >
              <Heart className={cn('h-4 w-4 transition-all', property.isFavorite && 'fill-current scale-110')} />
            </Button>
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-muted via-muted/70 to-muted/50">
            <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">Sem imagem</p>
          </div>
        )}

        <CardContent className="flex-grow p-5">
          {/* Header com badges e menu */}
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={property.type === 'ready' ? 'default' : 'secondary'}
                className="flex items-center gap-1.5 px-2.5 py-1 font-medium"
              >
                {property.type === 'ready' ? (
                  <>
                    <Home className="h-3.5 w-3.5" />
                    Pronto
                  </>
                ) : (
                  <>
                    <HardHat className="h-3.5 w-3.5" />
                    Na Planta
                  </>
                )}
              </Badge>
              {property.visited && (
                <Badge variant="outline" className="border-success text-success">
                  Visitado
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
          <h2 className="mb-2 line-clamp-2 text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {property.name}
          </h2>

          {/* Localização */}
          <p className="mb-5 line-clamp-1 text-sm text-muted-foreground">
            {property.address.neighborhood}, {property.address.city} - {property.address.state}
          </p>

          {/* Preço */}
          <div className="mb-5 rounded-lg bg-primary/5 p-3">
            <p className="text-2xl font-bold tracking-tight text-primary">
              {formatCurrency(totalPrice)}
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {formatCurrency(pricePerSqm)}/m²
            </p>
          </div>

          {/* Características */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
              <Ruler className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{formatArea(property.privateArea)}</span>
            </div>

            {property.bedrooms > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                <Bed className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{property.bedrooms}</span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                <Bath className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{property.bathrooms}</span>
              </div>
            )}

            {property.parkingSpots > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{property.parkingSpots}</span>
              </div>
            )}
          </div>

          {/* Info adicional para na planta */}
          {property.type === 'under_construction' && property.deliveryDate && (
            <div className="mb-4 rounded-md border border-warning/30 bg-warning/5 px-3 py-2">
              <p className="text-xs font-medium text-warning-foreground">
                Entrega prevista: {formatDate(property.deliveryDate, 'MM/yyyy')}
              </p>
            </div>
          )}

          {/* Custos mensais */}
          {(property.condoFee > 0 || property.iptu > 0) && (
            <div className="mb-4 flex flex-wrap gap-2 border-t pt-4">
              {property.condoFee > 0 && (
                <div className="rounded-md bg-muted/30 px-2.5 py-1.5 text-xs">
                  <span className="font-medium">Condomínio:</span>{' '}
                  <span className="text-muted-foreground">{formatCurrency(property.condoFee)}/mês</span>
                </div>
              )}
              {property.iptu > 0 && (
                <div className="rounded-md bg-muted/30 px-2.5 py-1.5 text-xs">
                  <span className="font-medium">IPTU:</span>{' '}
                  <span className="text-muted-foreground">{formatCurrency(property.iptu)}/ano</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {property.tags && property.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {property.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
              {property.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
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

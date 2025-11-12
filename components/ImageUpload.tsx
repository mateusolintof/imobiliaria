'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  propertyId?: string
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  propertyId,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitido`)
      return
    }

    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} não é uma imagem válida`)
          continue
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} é muito grande (máximo 5MB)`)
          continue
        }

        // Gerar nome único para o arquivo
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const fileExt = file.name.split('.').pop()
        const fileName = `${propertyId || 'temp'}_${timestamp}_${randomStr}.${fileExt}`
        const filePath = `property-images/${fileName}`

        // Upload para o Supabase Storage
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (error) {
          console.error('Error uploading file:', error)
          toast.error(`Erro ao fazer upload de ${file.name}`)
          continue
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls])
        toast.success(`${uploadedUrls.length} ${uploadedUrls.length === 1 ? 'imagem enviada' : 'imagens enviadas'} com sucesso`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index]

    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/property-images/')
      if (urlParts.length === 2) {
        const filePath = `property-images/${urlParts[1]}`

        // Remover do Supabase Storage
        await supabase.storage
          .from('properties')
          .remove([filePath])
      }

      // Remover da lista
      const newImages = images.filter((_, i) => i !== index)
      onChange(newImages)
      toast.success('Imagem removida')
    } catch (error) {
      console.error('Error removing image:', error)
      toast.error('Erro ao remover imagem')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Imagens do Imóvel ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Imagens
              </>
            )}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {images.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-2 border-dashed p-8">
          <ImageIcon className="mb-2 h-12 w-12 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Nenhuma imagem adicionada</p>
          <p className="text-xs text-muted-foreground">
            Adicione fotos do imóvel (máximo {maxImages})
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <Card key={index} className="group relative overflow-hidden">
              <div className="aspect-square">
                <img
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                  Principal
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        A primeira imagem será usada como capa do imóvel. Arraste para reordenar (em breve).
        Tamanho máximo: 5MB por imagem.
      </p>
    </div>
  )
}

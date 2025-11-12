# Configuração do Supabase Storage para Upload de Imagens

## Passo 1: Criar o Bucket

1. Acesse o painel do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em **Storage**
4. Clique em **New bucket**
5. Configure o bucket:
   - **Name**: `properties`
   - **Public bucket**: ✅ Marque esta opção (para URLs públicas)
   - **File size limit**: `5MB` (opcional)
   - **Allowed MIME types**: `image/*` (opcional, para aceitar apenas imagens)
6. Clique em **Create bucket**

## Passo 2: Configurar Políticas de Acesso (RLS)

### Política para Upload (INSERT)
Permite que usuários autenticados façam upload:

```sql
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'properties');
```

### Política para Leitura (SELECT)
Permite que todos vejam as imagens:

```sql
CREATE POLICY "Imagens são públicas"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'properties');
```

### Política para Exclusão (DELETE)
Permite que usuários autenticados deletem suas próprias imagens:

```sql
CREATE POLICY "Usuários podem deletar suas próprias imagens"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'properties');
```

## Passo 3: Adicionar coluna 'images' na tabela 'properties'

Execute este comando SQL no **SQL Editor** do Supabase:

```sql
-- Adicionar coluna images como array de texto
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS images text[];

-- Adicionar índice para melhor performance (opcional)
CREATE INDEX IF NOT EXISTS idx_properties_images
ON properties USING GIN (images);
```

## Passo 4: Testar o Upload

1. Execute `npm run dev` no seu projeto
2. Acesse a página de **Cadastro de Imóvel**
3. Vá até o último passo (Dados Financeiros)
4. Role até o final e você verá a seção **"Imagens do Imóvel"**
5. Clique em **"Adicionar Imagens"**
6. Selecione uma ou mais imagens (máx 10, 5MB cada)
7. As imagens serão enviadas automaticamente para o Supabase Storage

## Funcionalidades Implementadas

✅ **Upload de múltiplas imagens** (até 10 por imóvel)
✅ **Validação de tipo e tamanho** (apenas imagens, máx 5MB)
✅ **Preview das imagens** no formulário
✅ **Remoção de imagens** individuais
✅ **Exibição de capa** no PropertyCard
✅ **Contador de imagens** (+X quando há mais de uma)
✅ **Placeholder** quando não há imagens

## Estrutura de Arquivos

- **Componente**: `/components/ImageUpload.tsx`
- **Integração**: `/components/cadastro/FinancialInfoStep.tsx`
- **Exibição**: `/components/PropertyCard.tsx`
- **Tipo**: `/types/index.ts` (campo `images?: string[]`)

## Troubleshooting

### Erro: "Bucket not found"
- Verifique se o bucket `properties` foi criado corretamente
- Confirme que o nome está exatamente como `properties`

### Erro: "Policy violation"
- Verifique se as políticas RLS foram criadas
- Confirme que você está autenticado no Supabase

### Imagens não aparecem
- Verifique se o bucket está marcado como **Public**
- Confirme que a política de SELECT permite acesso público

### Erro ao deletar imagens
- Verifique se a política de DELETE está configurada
- Confirme que você tem permissão para deletar o arquivo

'use client'

import MainLayout from '@/components/MainLayout'

export default function CompararPage() {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Comparar Imóveis
          </h1>
          <p className="text-gray-600">
            Compare múltiplos imóveis lado a lado e analise trade-offs.
          </p>
          <p className="mt-4 text-sm text-amber-600">
            Em desenvolvimento...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

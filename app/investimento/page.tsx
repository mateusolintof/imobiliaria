'use client'

import MainLayout from '@/components/MainLayout'

export default function InvestimentoPage() {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Análise de Investimento
          </h1>
          <p className="text-gray-600">
            Calcule rentabilidade, Cap Rate, IRR e analise riscos de investimento imobiliário.
          </p>
          <p className="mt-4 text-sm text-amber-600">
            Em desenvolvimento...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

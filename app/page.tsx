'use client'

import MainLayout from '@/components/MainLayout'

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Bem-vindo à Plataforma de Análise Imobiliária
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Organize seus imóveis, simule cenários financeiros e tome decisões mais informadas.
          </p>
          <p className="mb-4 text-sm font-medium text-gray-700">
            Use a navegação acima para começar:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <div>
                <strong className="text-gray-900">Cadastro:</strong>
                <span className="text-gray-600"> Adicione imóveis ao seu portfólio</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <div>
                <strong className="text-gray-900">Meus Imóveis:</strong>
                <span className="text-gray-600"> Gerencie e organize seus imóveis</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <div>
                <strong className="text-gray-900">Moradia:</strong>
                <span className="text-gray-600"> Simule financiamentos e custos de moradia</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <div>
                <strong className="text-gray-900">Investimento:</strong>
                <span className="text-gray-600"> Analise rentabilidade e riscos</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <div>
                <strong className="text-gray-900">Comparar:</strong>
                <span className="text-gray-600"> Compare múltiplos imóveis lado a lado</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              <div>
                <strong className="text-gray-900">Parâmetros:</strong>
                <span className="text-gray-600"> Configure suas preferências</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}

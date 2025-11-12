'use client'

import React from 'react'
import Sidebar from '@/components/Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-[280px]">
        <main className="flex-1 bg-background p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card px-6 py-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-sm text-muted-foreground">
              Plataforma de Análise Imobiliária © {new Date().getFullYear()}
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Os dados e simulações fornecidos não constituem aconselhamento financeiro ou tributário.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

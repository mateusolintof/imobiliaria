'use client'

import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container
} from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import HomeIcon from '@mui/icons-material/Home'
import AddHomeIcon from '@mui/icons-material/AddHome'
import ListIcon from '@mui/icons-material/List'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import SettingsIcon from '@mui/icons-material/Settings'

interface MainLayoutProps {
  children: React.ReactNode
}

const routes = [
  { path: '/', label: 'Início', icon: <HomeIcon /> },
  { path: '/cadastro', label: 'Cadastro', icon: <AddHomeIcon /> },
  { path: '/meus-imoveis', label: 'Meus Imóveis', icon: <ListIcon /> },
  { path: '/moradia', label: 'Moradia', icon: <AttachMoneyIcon /> },
  { path: '/investimento', label: 'Investimento', icon: <TrendingUpIcon /> },
  { path: '/comparar', label: 'Comparar', icon: <CompareArrowsIcon /> },
  { path: '/parametros', label: 'Parâmetros', icon: <SettingsIcon /> },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = routes.findIndex(route => route.path === pathname)
  const tabValue = currentTab >= 0 ? currentTab : 0

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(routes[newValue].path)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Plataforma Imobiliária
          </Typography>
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: 'primary.dark',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.7)',
              minHeight: 64,
            },
            '& .Mui-selected': {
              color: 'white',
            },
          }}
        >
          {routes.map((route, index) => (
            <Tab
              key={route.path}
              icon={route.icon}
              label={route.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          bgcolor: 'grey.100',
          borderTop: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            Plataforma de Análise Imobiliária © {new Date().getFullYear()}
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
            Os dados e simulações fornecidos não constituem aconselhamento financeiro ou tributário.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

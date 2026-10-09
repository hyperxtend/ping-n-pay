import type { ReactNode } from 'react'
import { Link as RouterLink, useMatch } from 'react-router-dom'
import { Box, Button, Paper, Typography } from '@mui/material'
import { colors, displayFont } from '../../theme'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const tabs = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/login/register' },
]

/**
 * Stacks every child in the same grid cell so the container is always as tall
 * as the tallest one; inactive layers are hidden (and removed from tab order
 * and the accessibility tree via visibility: hidden).
 */
function Layers({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'grid' }}>{children}</Box>
}

function Layer({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <Box sx={{ gridArea: '1 / 1', minWidth: 0, visibility: active ? 'visible' : 'hidden' }}>
      {children}
    </Box>
  )
}

export default function AuthLayout() {
  const isRegister = !!useMatch('/login/register')

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        // Doodle tile repeats on top of the gradient
        background: `url(/auth-pattern.svg) repeat, linear-gradient(135deg, ${colors.winePlum} 0%, ${colors.burntRose} 100%)`,
        backgroundSize: '400px 400px, cover',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          borderRadius: 6,
          bgcolor: colors.porcelain,
          boxShadow: '0 24px 60px rgba(8, 7, 5, 0.25)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Layers>
            <Layer active={!isRegister}>
              <Typography variant="h4" component="h1" sx={{ fontFamily: displayFont, fontWeight: 700, color: 'text.primary' }}>
                Ping 'n Pay 
              </Typography>
            </Layer>
            <Layer active={isRegister}>
              <Typography variant="h4" component="h1" sx={{ fontFamily: displayFont, fontWeight: 700, color: 'text.primary' }}>
                Create account
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Set up your organisation on Ping 'n Pay
              </Typography>
            </Layer>
            </Layers>
          <Box
            component="img"
            src={isRegister ? '/register-logo.svg' : '/bell-logo.svg'}
            alt=""
            sx={{ width: 96, height: 96, mb: 1.5 }}
          />
        </Box>

        {/* Login / Register tabs */}
        <Box
          component="nav"
          aria-label="Authentication"
          sx={{
            mt: 4,
            p: 0.5,
            display: 'flex',
            gap: 0.5,
            borderRadius: 3,
            bgcolor: 'rgba(64, 67, 78, 0.08)',
          }}
        >
          {tabs.map((tab) => {
            const active = (tab.to === '/login/register') === isRegister
            return (
              <Button
                key={tab.to}
                fullWidth
                component={RouterLink}
                to={tab.to}
                replace
                variant={active ? 'contained' : 'text'}
                aria-current={active ? 'page' : undefined}
                sx={{ py: 1.25, borderRadius: 2.5, ...(!active && { color: 'text.secondary' }) }}
              >
                {tab.label}
              </Button>
            )
          })}
        </Box>

        {/* Both forms stay mounted so the card keeps the same height across tabs */}
        <Layers>
          <Layer active={!isRegister}>
            <LoginForm />
          </Layer>
          <Layer active={isRegister}>
            <RegisterForm />
          </Layer>
        </Layers>
      </Paper>
    </Box>
  )
}

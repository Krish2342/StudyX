import { MotionConfig } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/hooks/ToastProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user" makes every Motion animation respect the OS setting. */}
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
)

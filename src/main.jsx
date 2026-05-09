import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthProvider.jsx'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './apollo/apolloClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <App />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)

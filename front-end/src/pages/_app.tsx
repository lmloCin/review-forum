import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/Header'
import '@/app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  )
} 
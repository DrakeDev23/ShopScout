import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root')!)

if (!PUBLISHABLE_KEY) {
  console.error('Missing VITE_CLERK_PUBLISHABLE_KEY: Set VITE_CLERK_PUBLISHABLE_KEY in frontend/.env.local or frontend/.env')
  root.render(
    <StrictMode>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
              !
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Missing Clerk Publishable Key</h1>
              <p className="text-sm text-slate-500">Authentication configuration required</p>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-slate-700">
            ShopScout requires a Clerk Publishable Key to handle authentication. Please add your key to your environment variables file.
          </p>

          <div className="mb-4 rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-100">
            <div className="text-slate-400"># In frontend/.env.local or frontend/.env</div>
            <div className="mt-1 text-sky-400">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</div>
          </div>

          <div className="text-xs leading-relaxed text-slate-600">
            You can obtain your publishable key from the{' '}
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700"
            >
              Clerk Dashboard
            </a>{' '}
            under <strong>API Keys</strong>.
          </div>
        </div>
      </div>
    </StrictMode>,
  )
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}

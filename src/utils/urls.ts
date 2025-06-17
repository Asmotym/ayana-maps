/**
 * Utility functions for dynamic URL generation
 */

export const getBaseUrl = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback for SSR or non-browser environments
  return import.meta.env.VITE_BASE_URL || 'http://localhost:5173'
}

export const getBackendUrl = (): string => {
  // Use environment variable if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL
  }
  
  // Dynamic backend URL based on current host
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = import.meta.env.VITE_BACKEND_PORT || '3001'
    return `${protocol}//${hostname}:${port}`
  }
  
  // Fallback for development
  return 'http://localhost:3001'
}

export const getRedirectUri = (): string => {
  // Use environment variable if available
  if (import.meta.env.VITE_REDIRECT_URI) {
    return import.meta.env.VITE_REDIRECT_URI
  }
  
  // Dynamic redirect URI
  return `${getBaseUrl()}/auth/callback`
}

export const getApiUrl = (endpoint: string): string => {
  return `${getBackendUrl()}/api${endpoint}`
} 
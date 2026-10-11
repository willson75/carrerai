import React, { createContext, useCallback, useEffect, useReducer } from 'react'
import { authApi, setAuthToken } from '@/lib/api'
import type {
  AnyUser,
  LoginCredentials,
  StudentRegisterData,
  CompanyRegisterData,
  UserRole,
} from '@/types'

// ─── State ────────────────────────────────────────────────────────────────────
interface AuthState {
  user: AnyUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AnyUser; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: AnyUser }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true }
    case 'AUTH_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      }
    case 'AUTH_FAILURE':
      return { user: null, token: null, isLoading: false, isAuthenticated: false }
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false, isAuthenticated: false }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  loginAdmin: (credentials: LoginCredentials) => Promise<void>
  registerStudent: (data: StudentRegisterData) => Promise<void>
  registerCompany: (data: CompanyRegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: AnyUser) => void
  hasRole: (role: UserRole) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // On mount — restore session from sessionStorage (tokens only; never passwords)
  useEffect(() => {
    const restore = async () => {
      dispatch({ type: 'AUTH_START' })
      try {
        const session = await authApi.restoreSession()
        if (session) {
          setAuthToken(session.token)
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: session.user, token: session.token } })
          return
        }
      } catch {
        /* fall through */
      }
      dispatch({ type: 'AUTH_FAILURE' })
    }
    restore()
  }, [])

  // Listen for 401 events from the api interceptor
  useEffect(() => {
    const handle = () => {
      dispatch({ type: 'LOGOUT' })
    }
    window.addEventListener('auth:unauthorized', handle)
    return () => window.removeEventListener('auth:unauthorized', handle)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const { user, token } = await authApi.login(credentials)
      setAuthToken(token)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE' })
      throw err
    }
  }, [])

  const loginAdmin = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const { user, token } = await authApi.loginAdmin(credentials)
      setAuthToken(token)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE' })
      throw err
    }
  }, [])

  const registerStudent = useCallback(async (data: StudentRegisterData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const { user, token } = await authApi.registerStudent(data)
      setAuthToken(token)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE' })
      throw err
    }
  }, [])

  const registerCompany = useCallback(async (data: CompanyRegisterData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const { user, token } = await authApi.registerCompany(data)
      setAuthToken(token)
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE' })
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      setAuthToken(null)
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  const updateUser = useCallback((user: AnyUser) => {
    dispatch({ type: 'UPDATE_USER', payload: user })
  }, [])

  const hasRole = useCallback(
    (role: UserRole) => state.user?.role === role,
    [state.user]
  )

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginAdmin,
        registerStudent,
        registerCompany,
        logout,
        updateUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

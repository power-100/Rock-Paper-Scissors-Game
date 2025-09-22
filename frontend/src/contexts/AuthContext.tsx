import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  location: string;
  avatar: string;
  createdAt: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
};

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOAD_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      if (action.payload.token.startsWith('demo-token-')) {
        localStorage.setItem('demoUser', JSON.stringify(action.payload.user));
      }
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('demoUser');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      localStorage.removeItem('demoUser');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'LOAD_USER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async (): Promise<void> => {
    if (state.token) {
      setAuthToken(state.token);
      try {
        const response = await api.get('/api/auth/me');
        dispatch({ type: 'LOAD_USER', payload: response.data.user });
      } catch (error) {
        console.log('Backend not available, checking for demo token');
        
        if (state.token && state.token.startsWith('demo-token-')) {
          const storedUser = localStorage.getItem('demoUser');
          if (storedUser) {
            try {
              dispatch({ type: 'LOAD_USER', payload: JSON.parse(storedUser) });
            } catch (parseError) {
              console.log('Error parsing stored user, clearing storage');
              localStorage.removeItem('demoUser');
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          } else {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'AUTH_ERROR' });
        }
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.log('Backend not available, using demo mode for login');
      
      if (email && password && email.includes('@') && password.length >= 6) {
        const demoUser: User = {
          id: 'demo-user-' + Date.now(),
          email: email,
          username: email.split('@')[0],
          fullName: 'Demo User',
          location: 'Demo City',
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${email.split('@')[0]}`,
          createdAt: new Date(),
        };
        
        const authData = {
          token: 'demo-token-' + Date.now(),
          user: demoUser,
        };
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData });
        return { success: true, message: '✅ Demo login successful!' };
      }
      
      return {
        success: false,
        message: 'Please enter a valid email and password (min 6 characters)',
      };
    }
  };

  // Register
  const register = async (userData: {
    email: string;
    password: string;
    username: string;
    fullName: string;
    location?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/api/auth/register', userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.log('Backend not available, using demo mode for registration');
      
      const { email, password, username, fullName, location } = userData;
      
      if (!email || !password || !username || !fullName) {
        return {
          success: false,
          message: 'Please fill in all required fields',
        };
      }
      
      if (!email.includes('@')) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }
      
      if (password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long',
        };
      }
      
      const demoUser: User = {
        id: 'demo-user-' + Date.now(),
        email: email,
        username: username,
        fullName: fullName,
        location: location || 'Demo City',
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
        createdAt: new Date(),
      };
      
      const authData = {
        token: 'demo-token-' + Date.now(),
        user: demoUser,
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: authData });
      return { success: true, message: '✅ Demo registration successful! Welcome to CivicReport!' };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  deleteToken: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // クッキーからトークンを取得
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  // トークンを保持するstate
  const [token, setToken] = useState<string | null>(cookies.token);
  // 認証状態を保持するstate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const updateToken = (newToken: string | null) => {
    // トークンがある場合はクッキーに保存
    if(newToken) {
      setCookie('token', newToken, { path: '/', httpOnly: true, secure: true, sameSite: 'strict' });
      setIsAuthenticated(true);
    } else {
      removeCookie('token');
    }
    setToken(newToken);
  };

  const deleteToken = () => {
    removeCookie('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
     // トークンの有効性チェックなどの追加ロジックをここに実装できます
     if(token){
      setIsAuthenticated(true);
     }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken: updateToken, deleteToken, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import { createContext, userState, useEffect } from 'react';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ 'name': 'Matthew' }}>
      {children}
    </AuthContext.Provider>
  )
}
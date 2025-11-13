import { createContext, useContext, useState } from "react";
const AuthCtx = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id:1, email:"admin@shop.com", role:"ADMIN" }); // mock
  const login = (email) => setUser({ id:1, email, role:"ADMIN" });
  const logout = () => setUser(null);
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
};
export const useAuth = () => useContext(AuthCtx);

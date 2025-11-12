import React, { createContext, useState, useEffect } from "react";

export const ContextoAuth = createContext();

export const ProveedorAuth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (token && u) {
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <ContextoAuth.Provider value={{ user, login, logout, loading }}>
      {children}
    </ContextoAuth.Provider>
  );
};

import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./route-config";
import AuthenticationContext from "./auth/AuthenticationContext";
import { getClaims } from "./auth/handleJWT";
import configureInterceptor from "./utils/httpinterceptors";
import ProtectedRoute from "./utils/ProtectedRoute";
import "../src/App.css";

configureInterceptor();

function App() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    setClaims(getClaims());
  }, []);

  function isLoggedIn() {
    return claims.length > 0; // Proveravamo da li korisnik ima JWT token
  }

  function isAdmin() {
    return (
      claims.findIndex(
        (claim) => claim.name === "role" && claim.value === "admin"
      ) > -1
    );
  }

  return (
    <BrowserRouter>
      <AuthenticationContext.Provider value={{ claims, update: setClaims }}>
        <Menu />
        <div className="container">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute
                    element={route.element}
                    isAdminRoute={route.isAdmin}
                    isLoggedInRoute={route.isLoggedIn}
                    isLoggedIn={isLoggedIn}
                    isAdmin={isAdmin}
                  />
                }
              />
            ))}
          </Routes>
        </div>
      </AuthenticationContext.Provider>
    </BrowserRouter>
  );
}

export default App;

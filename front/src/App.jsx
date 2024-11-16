import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./route-config";
import AuthenticationContext from "./auth/AuthenticationContext";
import { getClaims } from "./auth/handleJWT";



function App() {

  const [claims, setClaims] = useState([]);

  useEffect(() => {
    setClaims(getClaims())
  }, []);

  return (
    <BrowserRouter>
    <AuthenticationContext.Provider value={{claims, update: setClaims}}>
      <Menu />
      <div className="container">
        <Routes>
          {routes.map((route) => 
          <Route
            key={route.path}
            path={route.path}
            element={
              <route.element/>
            }
          />)}
        </Routes>
      </div>
      </AuthenticationContext.Provider>
    </BrowserRouter>
  );
}

export default App;

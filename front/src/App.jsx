import React from "react";
import Menu from "./Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./route-config";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;

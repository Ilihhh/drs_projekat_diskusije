import React from "react";

const AuthenticationContext = React.createContext({
  claims: [],
  update: () => {},  
});

export default AuthenticationContext;

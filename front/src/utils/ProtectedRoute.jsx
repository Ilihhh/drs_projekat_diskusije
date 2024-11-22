import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ element: Element, ...props }) {            // mora ovako jer u propovima prosledjujemo react element (funkciju)
    const navigate = useNavigate();                                                 // a ne komponentu (komponenta je u ovom slucaju vec instancirana)

  // Provera administratorskih privilegija
  if (props.isAdminRoute && !props.isAdmin()) {
    return <>You are not allowed to view this page</>;
  }

  // Provera prijavljenosti
  if (props.isLoggedInRoute && !props.isLoggedIn()) {
    // Redirekcija na login stranicu sa query parametrom
    navigate(`/login?redirected=true`);
    return null; // Ne prikazujemo ništa dok se redirekcija ne izvrši
  }

  return <Element {...props} />;
}

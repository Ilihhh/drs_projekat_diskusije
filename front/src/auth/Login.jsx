import axios from "axios";
import LoginForm from "../forms/LoginForm";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { urlLogin } from "../utils/endpoints";
import { saveToken } from "./handleJWT";
import { useContext } from "react";
import AuthenticationContext from "./AuthenticationContext";
import { getClaims } from "./handleJWT";
import Swal from "sweetalert2"; // Import SweetAlert

export default function Login() {
  const { update } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirected = new URLSearchParams(location.search).get("redirected");

  async function login(credentials) {
    console.log("Logging in with credentials: ", credentials);

    try {
      const response = await axios.post(urlLogin, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login successful. Token: ", response.data.token);

      // Sačuvaj token i ažuriraj stanje autentifikacije
      saveToken(response.data);
      update(getClaims());

      // SweetAlert potvrda o uspehu
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonText: "Go to Home",
      }).then(() => {
        // Redirekcija na početnu stranicu ili dashboard
        navigate("/");
      });
    } catch (error) {
      console.error("Error during login: ", error);

      // SweetAlert za grešku prilikom logovanja
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
      });
    }
  }

  return (
    <>
      {redirected && (
        <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
        You need to log in to access that page.
        <br /> {/* Novi red */}
        <span>
          Don’t have an account? <Link to="/register">Register</Link>
        </span>
      </p>
      
      )}
      <h3>Login</h3>
      <LoginForm
        model={{ email: "", password: "" }}
        onSubmit={async (values) => await login(values)}
      />
    </>
  );
}

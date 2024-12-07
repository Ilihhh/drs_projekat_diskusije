import axios from "axios";
import LoginForm from "../forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { urlLogin } from "../utils/endpoints";
import { saveToken } from "./handleJWT";
import { useContext } from "react";
import AuthenticationContext from "./AuthenticationContext";
import { getClaims } from "./handleJWT";
import BlackSwal from "../utils/BlackSwal";
export default function Login() {
  const { update } = useContext(AuthenticationContext);
  const navigate = useNavigate();

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
      BlackSwal.fire({
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
      BlackSwal.fire({
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
      <LoginForm
        model={{ email: "", password: "" }}
        onSubmit={async (values) => await login(values)}
      />
    </>
  );
}

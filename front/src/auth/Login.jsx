import axios from "axios";
import LoginForm from "../forms/LoginForm";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Dodali smo Link
import { urlLogin } from "../utils/endpoints";
import { saveToken } from "./handleJWT";
import { useContext } from "react";
import AuthenticationContext from "./AuthenticationContext";
import { getClaims } from "./handleJWT";

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
      saveToken(response.data);
      update(getClaims());
      navigate("/");
    } catch (error) {
      console.error("Error during login: ", error);
    }
  }

  return (
    <>
      {redirected && (
        <p>
          You need to log in to access that page.{" "}
          <span>
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
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

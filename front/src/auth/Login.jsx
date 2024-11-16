import axios from "axios";
import LoginForm from "../forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { urlLogin } from "../utils/endpoints";
import { saveToken } from "./handleJWT";
import { useContext } from "react";
import AuthenticationContext from "./AuthenticationContext";
import {getClaims} from "./handleJWT";

export default function Login() {

    const {update} = useContext(AuthenticationContext);
    const navigate = useNavigate();

    async function login(credentials) {
        console.log("Logging in with credentials: ", credentials);

        try {
            const response = await axios.post(urlLogin, credentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Login successful. Token: ", response.data.token);
            // localStorage.setItem("auth_token", response.data.token);                            //ovo treda se izmesti odavde 
            saveToken(response.data);
            update(getClaims())
            navigate('/')

        } catch (error) {
            console.error("Error during login: ", error);
        }
    }

    return (
        <>
            <h3>Login</h3>
            <LoginForm
                model={{ email: '', password: '' }}
                onSubmit={async values => await login(values)}
            />
        </>
    );
}

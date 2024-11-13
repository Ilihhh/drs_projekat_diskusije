import axios from "axios";
import LoginForm from "../forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { urlLogin } from "../utils/endpoints";

export default function Login() {

    const navigate = useNavigate();

    async function login(credentials) {
        console.log("Logging in with credentials: ", credentials);

        const mappedCredentials = {                     //Ovo mora da se radi jer je DEGENIRIK (Ilija Brdaric PR 55/2021) nazvao modele u pajton aplikaciji i polja u formi razlicito
            email: credentials.email,
            lozinka: credentials.password  
        };

        try {
            const response = await axios.post(urlLogin, mappedCredentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Login successful. Token: ", response.data.token);
            localStorage.setItem("auth_token", response.data.token);                            //ovo treda se izmesti odavde 
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

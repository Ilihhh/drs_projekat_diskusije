import React from "react";
import axios from "axios";
import RegisterForm from "../forms/RegisterForm";
import { urlRegister } from "../utils/endpoints";

export default function Register() {
    async function register(registerData) {
        try {
            const dataToSend = {
                email: registerData.email,
                lozinka: registerData.password,
                ime: registerData.firstName,
                prezime: registerData.lastName,
                grad: registerData.city,
                drzava: registerData.state,
                broj_telefona: registerData.phoneNumber,
                korisnicko_ime: registerData.username
            };

            const response = await axios.post(urlRegister, dataToSend, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                console.log("User registered successfully:", response.data);
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    }

    return (
        <>
            <h3>Register</h3>
            <RegisterForm
                model={{ username: '', firstName: '', lastName: '', address: '', city: '', state: '', phoneNumber: '', email: '', password: '' }}
                onSubmit={async values => await register(values)}
            />
        </>
    );
}

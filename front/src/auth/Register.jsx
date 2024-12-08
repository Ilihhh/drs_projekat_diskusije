import React from "react";
import axios from "axios";
import RegisterEditForm from "../forms/RegisterEditForm";
import { urlRegister } from "../utils/endpoints";
import { useNavigate } from "react-router-dom";
import BlackSwal from "../utils/BlackSwal";

export default function Register() {
  const navigate = useNavigate();

  async function register(registerData) {
    try {
      console.log(registerData);

      const response = await axios.post(urlRegister, registerData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Obrada specifičnih grešaka odmah, bez potrebe za catch blokom
      if (response.status === 201) {
        console.log("User registered successfully:", response.data);

        // SweetAlert potvrda za uspešnu registraciju
        BlackSwal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Please wait for admin approval before logging in!",
          confirmButtonText: "Go to Home",
        }).then(() => {
          navigate("/"); // Redirekcija na početnu stranicu
        });
      } else {
        // Ako status nije 201, možemo obraditi grešku na osnovu odgovora
        BlackSwal.fire({
          icon: "error",
          title: "Registration Failed",
          text: response.data.message || "Unexpected error. Please try again.",
        });
      }
    } catch (error) {
      // Obrada neočekivanih grešaka koje nisu vezane za odgovor sa servera
      console.error("Error during registration:", error);

      BlackSwal.fire({
        icon: "error",
        title: "Error",
        text: "Username or Email Adress already in use.",
      });
    }
  }

  return (
    <>
      <RegisterEditForm
        edit={false}
        model={{
          username: "",
          first_name: "",
          last_name: "",
          address: "",
          city: "",
          country: "",
          phone_number: "",
          email: "",
          password: "",
        }}
        onSubmit={async (values) => await register(values)}
      />
    </>
  );
}

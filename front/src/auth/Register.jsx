import React from "react";
import axios from "axios";
import RegisterEditForm from "../forms/RegisterEditForm";
import { urlRegister } from "../utils/endpoints";
import { useNavigate } from "react-router-dom";
import BlackSwal from "../utils/BlackSwal"

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
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);

        // SweetAlert greška sa servera
        BlackSwal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.response.data.message || "Please try again later.",
        });
      } else {
        console.error("Error during registration:", error);

        // SweetAlert generička greška
        BlackSwal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error during registration. Please try again later.",
        });
      }
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

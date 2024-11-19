import React from "react";
import axios from "axios";
import RegisterEditForm from "../forms/RegisterEditForm";
import { urlRegister } from "../utils/endpoints";
import { useNavigate } from "react-router-dom";

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
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
      } else {
        console.error("Error during registration:", error);
      }
    }
  }

  return (
    <>
      <h3>Register</h3>
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

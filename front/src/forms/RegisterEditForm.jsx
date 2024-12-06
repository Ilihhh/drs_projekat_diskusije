import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/LoginRegisterStyle.css";

export default function RegisterEditForm(props) {
  return (
    <Formik
      initialValues={props.model}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Poziv funkcije za registraciju ili ažuriranje profila
          await props.onSubmit(values);

          // SweetAlert potvrda o uspehu
          if (props.edit) {
            Swal.fire({
              icon: "success",
              title: "Profile Updated",
              text: "Your profile has been updated successfully!",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Registration Successful",
              text: "Please wait for admin approval before logging in!",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error during submission:", error);

          // SweetAlert za grešku
          Swal.fire({
            icon: "error",
            title: props.edit ? "Update Failed" : "Registration Failed",
            text: "An error occurred. Please try again.",
          });
        } finally {
          setSubmitting(false);
        }
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .max(50, "Username must not exceed 50 characters")
          .required("This field is required"),
        first_name: Yup.string()
          .max(50, "First name must not exceed 50 characters")
          .required("This field is required"),
        last_name: Yup.string()
          .max(50, "Last name must not exceed 50 characters")
          .required("This field is required"),
        address: Yup.string()
          .max(255, "Address must not exceed 255 characters")
          .required("This field is required"),
        city: Yup.string()
          .max(50, "City must not exceed 50 characters")
          .required("This field is required"),
        country: Yup.string()
          .max(50, "Country must not exceed 50 characters")
          .required("This field is required"),
        phone_number: Yup.string()
          .max(20, "Phone number must not exceed 20 characters")
          .required("This field is required"),
        email: Yup.string()
          .max(120, "Email must not exceed 120 characters")
          .required("This field is required")
          .email("You have to insert a valid email"),
        password: props.edit
          ? Yup.string()
          : Yup.string().required("This field is required"),
      })}
    >
      {(formikProps) => (
        <Form className="register-edit-form-container">
          <h3>{props.edit ? "Edit User" : "Register"}</h3>
          <TextField displayName="Username" field="username" type="text" />
          <TextField displayName="First Name" field="first_name" type="text" />
          <TextField displayName="Last Name" field="last_name" type="text" />
          <TextField displayName="Address" field="address" type="text" />
          <TextField displayName="City" field="city" type="text" />
          <TextField displayName="Country" field="country" type="text" />
          <TextField
            displayName="Phone Number"
            field="phone_number"
            type="tel"
          />
          <TextField displayName="Email" field="email" type="text" />
          <TextField displayName="Password" field="password" type="password" />

          <Button disabled={formikProps.isSubmitting} type="submit">
            Confirm
          </Button>
          <Link className="btn btn-secondary" to="/">
            Cancel
          </Link>
        </Form>
      )}
    </Formik>
  );
}

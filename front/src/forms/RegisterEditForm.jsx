import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/LoginRegisterStyle.css";

export default function RegisterEditForm(props) {
  return (
    <Formik
      initialValues={props.model}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await props.onSubmit(values);

          // SweetAlert confirmation
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

          // SweetAlert error message
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
        username: Yup.string().required("This field is required"),
        first_name: Yup.string().required("This field is required"),
        last_name: Yup.string().required("This field is required"),
        address: Yup.string().required("This field is required"),
        city: Yup.string().required("This field is required"),
        country: Yup.string().required("This field is required"),
        phone_number: Yup.string().required("This field is required"),
        email: Yup.string()
          .required("This field is required")
          .email("Valid email required"),
        password: props.edit
          ? Yup.string()
          : Yup.string().required("This field is required"),
      })}
    >
      {(formikProps) => (
        <div className="register-edit-form-container">
          <h2>{props.edit ? "Update Your Profile" : "Register"}</h2>
          <Form>
            <TextField displayName="Username" field="username" type="text" />
            <TextField
              displayName="First Name"
              field="first_name"
              type="text"
            />
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
            <TextField
              displayName="Password"
              field="password"
              type="password"
            />

            <div className="form-buttons">
              <button disabled={formikProps.isSubmitting} type="submit">
                Confirm
              </button>
              <Link className="btn-secondary" to="/">
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}

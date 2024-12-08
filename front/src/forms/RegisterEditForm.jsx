import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import "../styles/LoginRegisterStyle.css";

export default function RegisterEditForm(props) {
  return (
    <Formik
      initialValues={props.model}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          // Poziv funkcije za registraciju ili ažuriranje profila
          await props.onSubmit(values);

        } catch (error) {
          console.error("Error during submission:", error);
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

          {/* Ovaj tekst se prikazuje samo kada je registracija u pitanju */}
          {!props.edit && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <p style={{ color: "white" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#5d87b0" }}>
                  Login here
                </Link>
              </p>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}

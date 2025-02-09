import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import "../styles/LoginRegisterStyle.css";

export default function LoginForm(props) {
  return (
    <Formik
      initialValues={props.model}
      onSubmit={props.onSubmit}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("This field is required")
          .email("You have to insert valid email"),
        password: Yup.string().required("This field is required"),
      })}
    >
      {(formikProps) => (
        <Form className="register-edit-form-container">
          <h3>Login</h3>
          <TextField displayName="Email" field="email" type="text" />
          <TextField displayName="Password" field="password" type="password" />

          <Button disabled={formikProps.isSubmitting} type="submit">
            Log In
          </Button>
          <Link className="btn btn-secondary" to="/">
            Cancel
          </Link>

          {/* Dodajemo tekst ispod dugmadi sa razmakom */}
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <p style={{ color: "white" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#5d87b0" }}>
                Register here
              </Link>
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );
}

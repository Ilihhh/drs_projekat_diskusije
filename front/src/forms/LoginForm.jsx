import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
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
          .email("Valid email required"),
        password: Yup.string().required("This field is required"),
      })}
    >
      {(formikProps) => (
        <div className="register-edit-form-container">
          <h2>Login</h2>
          <Form>
            <TextField displayName="Email" field="email" type="text" />
            <TextField
              displayName="Password"
              field="password"
              type="password"
            />

            <div className="form-buttons">
              <button disabled={formikProps.isSubmitting} type="submit">
                Log In
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

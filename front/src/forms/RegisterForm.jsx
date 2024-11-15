import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import Button from "../utils/Button";
import { Link } from "react-router-dom";

export default function RegisterForm(props) {
  return (
    <Formik
      initialValues={props.model}
      onSubmit={props.onSubmit}
      validationSchema={Yup.object({
        username: Yup.string().required("This field is required"),
        first_name: Yup.string().required("This field is required"),
        last_name: Yup.string().required("This field is required"),
        address: Yup.string().required("This field is required"),
        city: Yup.string().required("This field is required"),
        state: Yup.string().required("This field is required"),
        phone_number: Yup.string()
          .required("This field is required"),
        email: Yup.string()
          .required("This field is required")
          .email("You have to insert valid email"),
        password: Yup.string().required("This field is required"),
      })}
    >
      {(formikProps) => (
        <Form>
          <TextField displayName="Username" field="username" type="text" />
          <TextField displayName="First Name" field="first_name" type="text" />
          <TextField displayName="Last Name" field="last_name" type="text" />
          <TextField displayName="Address" field="address" type="text" />
          <TextField displayName="City" field="city" type="text" />
          <TextField displayName="State" field="state" type="text" />
          <TextField displayName="Phone Number" field="phone_number" type="tel" />
          <TextField displayName="Email" field="email" type="text" />
          <TextField displayName="Password" field="password" type="password" />

          <Button disabled={formikProps.isSubmitting} type="submit">
            Register
          </Button>
          <Link className="btn btn-secondary" to="/">
            Cancel
          </Link>
        </Form>
      )}
    </Formik>
  );
}

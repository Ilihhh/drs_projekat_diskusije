import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import Button from "../utils/Button";
import {Link} from "react-router-dom";

export default function LoginForm(props) {
  return (<Formik
    initialValues={props.model}
    onSubmit={props.onSubmit}
    validationSchema={Yup.object({
      email: Yup.string()
        .required("This field is required")
        .email("You have to insert valid email"),
      password: Yup.string().required("This field is required"),
    })}
  >
    {(formikProps) => <Form>
        <TextField displayName="Email" field="email" type="text"/>
        <TextField displayName="Password" field="password" type="password"/>

        <Button disabled = {formikProps.isSubmitting} type="submit">Log In</Button>
        <Link className="btn btn-secondary" to="/">Cancel</Link>
        </Form>}
  </Formik>);
}

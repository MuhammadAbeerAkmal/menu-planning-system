import React, {useEffect} from "react";
import "./SignInForm.scss";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Formik } from "formik";
import http from "../../../services/httpService";
import { useHistory } from "react-router-dom";
import SnackbarPop from "../../SharedComponents/SnackbarPop/SnackbarPop";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignInForm = (props) => {
  const history = useHistory();
  const [type,setType]=React.useState("")
  const [open, setOpen] = React.useState(false);
  const [errorResponse, setErrorResponse]= React.useState("");
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
        display: "block",
      },
    },
  }));
  const classes = useStyles();
    const handleClose = (event, reason) => {
        setOpen(false);
    };



  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        enableReinitialize={true}
        validateOnChange={false}
        validateOnBlur={false}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Email is required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.password) {
            errors.password = "Password is required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          let data = {
            email: values.email,
            password: values.password,
            type: props.type
          };
          http
            .post("/users/authenticate", data)
            .then((response) => {
              const user = JSON.stringify(response.data);
              localStorage.setItem("user", user);
              history.push("/dashboard");
            })
            .catch((error) => {
                setErrorResponse(error.response.data.message)
                setOpen(true)
            });
        }}
      >
        {({ handleChange, handleSubmit, errors, resetForm }) => (
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <TextField
                required
                name="email"
                id="email"
                label="Email ID"
                type="email"
                onChange={handleChange}
                data-testid='login_email'
              />
              <div className={"error"}>{errors.email}</div>
              <TextField
                required
                name="password"
                id="password"
                label="Enter Password"
                type="password"
                data-testid='login_password'
                onChange={handleChange}
              />
              <div className={"error"}>{errors.password}</div>
            </div>
            <Button
              
              variant="contained"
              color="primary"
              type="submit"
              data-testid="login-btn"
              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={"error"}>
                    {errorResponse}
                </Alert>
            </Snackbar>
        </div>
    </>
  );
};

export default SignInForm;

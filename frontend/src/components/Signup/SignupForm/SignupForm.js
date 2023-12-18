import React, { useState } from "react";
import "./SignupForm.scss";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
import { Formik } from "formik";
import http from "../../../services/httpService";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignupForm = (props) => {
  const { type } = props;
  const [open, setOpen] = React.useState(false);
  const [responseMessage, setResponseMessage]= React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(3),
        width: "25ch",
        display: "block",
      },
    },
  }));
  const classes = useStyles();

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e);
  };
  const handleClose = (event, reason) => {
    setOpen(false);
  };
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          userName: "",
          phoneNumber: "",
        }}
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
          if (!values.userName) {
            errors.userName = "Username is required";
          }
          return errors;
        }}
        onSubmit={(values) => {
          let data = {
            email: values.email,
            password: values.password,
            phoneNumber: phoneNumber,
            username: values.userName,
            type: type,
          };
          http
            .post("/users/register", data)
            .then((response) => {
              setOpen(true)
              setResponseMessage(JSON.stringify(response.data))
              setSeverity("success")
            })
            .catch((error) => {
              setOpen(true)
              setResponseMessage(JSON.stringify(error.response.data.message))
              setSeverity("error")
            });
        }}
      >
        {({ handleChange, handleSubmit, errors }) => (
          <form
          
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div  
             >
              <TextField
                required
                name="userName"
                id="userName"
                label="Username"
                type="text"
                data-testid='username-input'
                onChange={handleChange}
              />
              <div className={"error"}>{errors.userName}</div>
              <TextField
                required
                name="email"
                id="email"
                label="Email ID"
                type="email"
                data-testid='email-input'
                onChange={handleChange}
              />
              <div className={"error"}>{errors.email}</div>
              <TextField
                required
                name="password"
                id="password"
                label="Create New Password"
                type="password"
                data-testid='password-input'
                onChange={handleChange}
              />
              <div className={"error"}>{errors.password}</div>
              <MuiPhoneNumber
                label="Phone Number (Optional)"
                defaultCountry={"us"}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <Button variant="contained" color="primary" type="submit" data-testid='btn' >
              Submit
            </Button>
          </form>
        )}
      </Formik>
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={severity}>
            {responseMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default SignupForm;

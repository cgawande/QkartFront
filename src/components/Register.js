import {
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const register = async () => {
    const { username, password, confirmPassword } = formData;

    setIsLoading(true);
    const url = `${config.endpoint}/auth/register`;
    const newUser = {
      username,
      password,
    };
    try {
      if (validateInput()) {
        const response = await axios.post(url, newUser);

        enqueueSnackbar("Registered successfully", { variant: "success" });
        
        history.push("/login");
      }
      setIsLoading(false);
      // return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(true);
      if (err.response && err.response.status === 400) {
        enqueueSnackbar("Username is already taken", { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong.", { variant: "error" });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = () => {
    const { username, password, confirmPassword } = formData;

    if (username) {
      if (username.length < 6) {
        enqueueSnackbar("Username must be at least 6 characters", {
          variant: "warning",
        });
        return false;
      }
    } else {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (password) {
      if (password.length < 6) {
        enqueueSnackbar("Password must be at least 6 characters", {
          variant: "warning",
        });
        return false;
      }
    } else {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (confirmPassword === password) return true;
    else {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e) => handleChange(e)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="success" size="2rem" />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;

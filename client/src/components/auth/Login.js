import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";
import Axios from "axios";
import { useCookies } from "react-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      const { data } = await Axios.post("/api/user/login", {
        email,
        password,
      });
      setCookie("user", data.user, { path: "/" });
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box component='form' marginTop={{ xs: "10rem", sm: "5rem" }}>
        <Paper elevation={3} sx={{ p: { sm: "3rem", xs: "2rem" } }}>
          <Typography mb={2} variant='h4' align='center'>
            Login
          </Typography>
          <TextField
            margin='normal'
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl
            size='small'
            margin='normal'
            variant='outlined'
            fullWidth
          >
            <InputLabel htmlFor='outlined-adornment-password'>
              Password
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment sx={{ cursor: "pointer" }} position='end'>
                  {showPassword ? (
                    <i
                      onClick={handleShowPassword}
                      className='fa-solid fa-eye'
                    ></i>
                  ) : (
                    <i
                      onClick={handleShowPassword}
                      className='fa-solid fa-eye-slash'
                    ></i>
                  )}
                </InputAdornment>
              }
              label='Password'
            />
          </FormControl>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            onClick={submitHandler}
          >
            {loading ? <LoadingSpinner /> : "Login"}
          </Button>
          <Grid container>
            <Grid item>
              <Link to='/register'>
                Don't have an account? <strong>Register</strong>
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

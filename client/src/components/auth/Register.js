import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../utils/LoadingSpinner';
import Axios from 'axios';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies();
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // password visibility toggle
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // handle image submission
  const handleImage = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setProfilePictureUrl(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      const { data } = await Axios.post('/api/user/register', {
        name,
        email,
        password,
        profilePictureUrl,
      });
      setCookie('user', data.user, { path: '/' });
      dispatch({ type: 'SET_USER', payload: data.user });
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box component='form' marginTop={{ xs: '5rem', sm: '3rem' }}>
        <Paper elevation={3} sx={{ p: { sm: '3rem', xs: '2rem' } }}>
          <Typography variant='h4' align='center'>
            Register
          </Typography>
          <TextField
            margin='normal'
            fullWidth
            id='name'
            label='name'
            name='name'
            size='small'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment sx={{ cursor: 'pointer' }} position='end'>
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

          <div>
            <input type='file' onChange={handleImage} />
          </div>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            onClick={submitHandler}
          >
            {loading ? <LoadingSpinner /> : 'Register'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='#'>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to='/'>
                Already have an account? <strong>Login</strong>
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

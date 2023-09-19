import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const RegisterForm = ()  => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="User Name" />
        <TextField name="email" label="Email address" />
        <TextField name="phone" label="Phone" />
        <TextField name="adress " label="Adress" />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        
        <Link variant="subtitle2" underline="hover" onClick={handleBackToLogin}>
          You have an account? Back to login
        </Link>
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleRegister}>
        Register
      </LoadingButton>
    </>
  );
}

export default RegisterForm
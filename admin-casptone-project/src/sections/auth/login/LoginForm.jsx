import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { authenLogin, authenValidation } from '../../../data/mutation/login/login-mutation';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    try {
      const userParams = {
        username,
        password,
      }
      const response = await authenLogin(userParams);
      const token = response.data.data.accessToken;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      if (response.status === 202) {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch('https://phu-tung-bom-be-tong-sg.azurewebsites.net/api/v1/auth/validation', requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.status);
          })
          .then((result) => {
            localStorage.setItem('role', `${result.data.role.name}`);
            localStorage.setItem('userName', `${result.data.lastName} ${result.data.firstName}`);
            localStorage.setItem('email', `${result.data.email}`);
            if (localStorage.getItem('role') === 'ADMIN') {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/login');
            }
          })
          .catch((error) => console.log('error', error));
      }

    } catch (error) {
      console.error("Error login user:", error)
    }
  };

  // const handleRegister = () => {
  //   navigate('/register');
  // };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Tên tài khoản" onChange={(e) => setUsername(e.target.value)} />

        <TextField
          name="password"
          label="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
        <Checkbox name="remember" label="Remember me" />
        {/* <Link variant="subtitle2" underline="hover">
          Quên mật khẩu?
        </Link> */}
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} sx={{ my: 1 }}>
        Đăng nhập
      </LoadingButton>

      {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleRegister}>
        Đăng ký
      </LoadingButton> */}
    </>
  );
}

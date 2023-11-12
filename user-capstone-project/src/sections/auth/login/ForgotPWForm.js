import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Divider, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function ForgotPWForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClick = () => {
        navigate('/dashboard', { replace: true });
    };

    const handleLogin = () => {
        navigate('/login', { replace: true });
    };

    return (
        <>
            <Stack spacing={3}>
                <TextField name="email" label="Email address" />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <h5>Chúng tôi sẽ gửi cho bạn một email cho phép bạn đặt lại mật khẩu của mình. {''}</h5>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Khôi phục mật khẩu
            </LoadingButton>

            <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                </Typography>
            </Divider>

            <LoadingButton variant="outlined" underline="hover" onClick={handleLogin}>
                Tạo tài khoản
            </LoadingButton>
        </>
    );
}

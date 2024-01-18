import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Link,
    Stack,
    IconButton,
    InputAdornment,
    TextField,
    Checkbox,
    Divider,
    Typography,
    Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { authenForget } from '~/data/mutation/login/login-mutation';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess';
import SnackbarError from '~/components/alert/SnackbarError';
import CloseIcon from '@mui/icons-material/Close';

// ----------------------------------------------------------------------

export default function ForgotPWForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Nếu địa chỉ email này được đăng ký, liên kết đặt lại mật khẩu đã được gửi.') {
            setSuccessMessage('Nếu địa chỉ email này được đăng ký, liên kết đặt lại mật khẩu đã được gửi.');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        } else if (message === 'Xóa ảnh thành công.') {
            setSuccessMessage('Xóa ảnh thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Category name was existed') {
            setErrorMessage('Tên thể loại đã tồn tại !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ');
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpen1(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}></Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );

    //========================== Hàm notification của trang ==================================

    const handleClick = async () => {
        try {
            const userParams = {
                email,
            };
            const response = await authenForget(userParams);
            if (response.status === 200) {
                handleSuccessMessage("Nếu địa chỉ email này được đăng ký, liên kết đặt lại mật khẩu đã được gửi.");
                console.log(response.message);
            }
        } catch (error) {
            console.error('Error login user:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    const handleLogin = () => {
        navigate('/login', { replace: true });
    };

    return (
        <>
            <Stack spacing={3}>
                <TextField
                    name="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <h5>Chúng tôi sẽ gửi cho bạn một email cho phép bạn đặt lại mật khẩu của mình. {''}</h5>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                Khôi phục mật khẩu
            </LoadingButton>

            <SnackbarSuccess
                open={open}
                handleClose={handleClose}
                message={successMessage}
                action={action}
                style={{ bottom: '16px', right: '16px' }}
            />
            <SnackbarError
                open={open1}
                handleClose={handleClose}
                message={errorMessage}
                action={action}
                style={{ bottom: '16px', right: '16px' }}
            />

            <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                </Typography>
            </Divider>

            <LoadingButton variant="outlined" underline="hover" onClick={handleLogin}>
                Quay lại
            </LoadingButton>
        </>
    );
}

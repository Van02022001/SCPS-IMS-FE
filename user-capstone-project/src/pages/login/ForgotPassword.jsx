import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Card } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
// sections
import ForgotPWForm from '~/sections/auth/login/ForgotPWForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

const ForgotPassword = () => {
    const mdUp = useResponsive('up', 'md');
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/login');
    };
    return (
        <>
            <Helmet>
                <title> Forgot Password | Minimal UI </title>
            </Helmet>

            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                <Container maxWidth="sm">
                    <Card>
                        <Button sx={{position: 'absolute', top: 150, left: 20 }} onClick={handleNavigate}>
                            <ArrowBackIcon fontSize="large" color="action" />
                        </Button>
                        <StyledContent>
                            <Typography
                                style={{ width: '100%', alignItems: 'center', textAlign: 'center' }}
                                variant="h4"
                                gutterBottom
                            >
                                Khôi phục tài khoản
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 5 }}>
                                <h4 style={{ marginTop: 20, marginBottom: 0 }}>
                                    Vui lòng cung cấp địa chỉ email bạn đã sử dụng khi đăng ký tài khoản. {''}
                                </h4>
                                <div style={{ width: '100%', alignItems: 'center', textAlign: 'center' }}>
                                    Nếu bạn quên email, vui lòng {''}
                                    <Link variant="subtitle2">liên hệ với chúng tôi.</Link>
                                </div>
                            </Typography>

                            <ForgotPWForm />
                        </StyledContent>
                    </Card>
                </Container>
            </StyledRoot>
        </>
    );
};
export default ForgotPassword;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { alpha } from '@mui/material/styles';
import {
    Box,
    Divider,
    Typography,
    Stack,
    MenuItem,
    Avatar,
    IconButton,
    Popover,
    Dialog,
    DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// mocks_
import account from '../../../_mock/account';
import UserInfoForm from '../../../sections/auth/home/UserInfoForm';
import { logout } from '~/data/mutation/login/login-mutation';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: 'Home',
        icon: 'eva:home-fill',
    },
    {
        label: 'Hồ sơ',
        icon: 'eva:person-fill',
    },
    {
        label: 'Settings',
        icon: 'eva:settings-2-fill',
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const [anchorEl, setAnchorEl] = useState(null);

    // const [openUseProfileForm, setOpenUseProfileForm] = useState(false);
    const [profilePopupOpen, setProfilePopupOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [refreshToken, setRefreshToken] = useState('');

    const navigate = useNavigate();

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        if (event.currentTarget.id === 'profile-label') {
            setProfilePopupOpen(true);
            setDialogOpen(true);
            setOpen(true);
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const rftoken = localStorage.getItem('refreshToken');
            const schemaParams = { refreshToken: rftoken, };
            const response = await logout(schemaParams);
            if (response.status === 202) {
                navigate('/login');
            } else {
                // Xử lý lỗi nếu cần.
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseUserProfileForm = () => {
        setOpen(false);
        setProfilePopupOpen(false);
        setDialogOpen(false);
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(anchorEl && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                        },
                    }),
                }}
            >
                <Avatar src={account.photoURL} alt="photoURL" />
            </IconButton>

            <Popover
                open={Boolean(anchorEl) && open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {account.displayName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {account.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem
                            key={option.label}
                            onClick={handleOpen}
                            id={option.label === 'Profile' ? 'profile-label' : ''}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
                    Đăng xuất
                </MenuItem>
            </Popover>

            <Dialog fullWidth maxWidth open={dialogOpen} onClose={handleCloseUserProfileForm}>
                <DialogTitle>
                    Hồ sơ tài khoản{' '}
                    <IconButton style={{ float: 'right' }} onClick={handleCloseUserProfileForm}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <UserInfoForm onClose={handleCloseUserProfileForm} />
            </Dialog>
        </>
    );
}

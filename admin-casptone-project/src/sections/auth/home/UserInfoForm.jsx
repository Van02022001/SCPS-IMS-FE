import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Button, TextField } from '@mui/material';
import account from '../../../_mock/account';

export default function UserInfoForm() {
    const [open, setOpen] = useState(null);
    const [firstName, setFirstName] = useState(account.firstName);
    const [midName, setMidName] = useState(account.midName);
    const [lastName, setLastName] = useState(account.lastName);
    const [email, setEmail] = useState(account.email);
    const [phone, setPhone] = useState(account.phone);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleSave = () => {
        // Add logic here to save user profile changes
        // You can send this data to your server or handle it as needed
        // Don't forget to update the 'account' object with the new data
        // Close the popover after saving
        handleClose();
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={account.photoURL} alt="photoURL" />
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 320, // Increase width for the user profile form
                        '& .MuiMenuItem-root': {
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    {/* Avatar */}
                    <Avatar src={account.photoURL} alt="photoURL" />

                    {/* Upload Image Button */}
                    <Button variant="outlined" sx={{ mt: 2 }}>
                        Upload Image
                    </Button>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {/* User Profile Form */}
                <Stack spacing={2} margin={2}>
                    <Typography variant="subtitle2" noWrap>
                        {account.displayName}
                    </Typography>
                    <div>
                        <TextField variant="outlined" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div>
                        <TextField variant="outlined" label="Middle Name" value={midName} onChange={(e) => setMidName(e.target.value)} />
                    </div>
                    <div>
                        <TextField variant="outlined" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div>
                        <TextField variant="outlined" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <TextField variant="outlined" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <Button color="primary" variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem onClick={handleClose} sx={{ m: 1 }}>
                    Logout
                </MenuItem>
            </Popover>
        </>
    );
}
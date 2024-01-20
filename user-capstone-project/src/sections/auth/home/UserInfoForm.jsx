import { useEffect, useState } from 'react';
// @mui
import { Visibility, VisibilityOff } from '@mui/icons-material';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Typography, Stack, Avatar, IconButton, Button, TextField, DialogContent, Grid, FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import account from '../../../_mock/account';
// api
import { authenChangePassword } from '../../../data/mutation/login/login-mutation';
import { uploadImageUser } from '~/data/mutation/image/image-mutation';

export default function UserInfoForm({ profileData }) {
    const [open, setOpen] = useState(null);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState(account.firstName);
    const [midName, setMidName] = useState(account.midName);
    const [lastName, setLastName] = useState(account.lastName);
    const [email, setEmail] = useState(account.email);
    const [phone, setPhone] = useState(account.phone);

    const [selectedFile, setSelectedFile] = useState(null);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            try {
                // Call the uploadImageUser function from your API file
                const response = await uploadImageUser(selectedFile);
                console.log('Image uploaded successfully:', response);

            } catch (error) {
                console.error('Error uploading image:', error);
                // Handle the error as needed
            }
        } else {

        }
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleSave = () => {
        handleClose();
    };

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    const handleSavePassword = async () => {
        try {
            const changeParams = {
                oldPassword,
                newPassword,
                confirmNewPassword,
            };

            const response = await authenChangePassword(changeParams);
            console.log("Change Password:", response);
            setIsEditingPassword(false);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleCancelPassword = () => {
        setIsEditingPassword(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    console.log(profileData);

    return (
        <Grid spacing={3}>
            {/* Avatar và User Profile Form */}
            <Grid item xs={12} sm={8} key={profileData.id}>
                <Grid container spacing={3}>

                    {/* Avatar */}
                    <Grid item xs={6} sm={6}>
                        <Box sx={{ textAlign: 'center', my: 1.5, px: 2.5 }} style={{ width: '90%' }}>
                            <Avatar src={profileData.image} alt="photoURL" style={{ height: 100, width: 100, margin: '0 auto' }} />
                            <Typography variant="subtitle2" noWrap>
                                Họ và tên: {profileData.firstName} {profileData.lastName}
                            </Typography>
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={handleUpload}>Tải hình ảnh</button>
                        </Box>
                    </Grid>

                    {/* User Profile Form */}
                    <Grid item xs={6} sm={6}>
                        <DialogContent  >

                            <Stack spacing={2} margin={2}>
                                <Grid item xs={12}>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}>

                                        <Typography variant="subtitle1" sx={{ fontSize: '14px', }}>
                                            Tên:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            sx={{ width: '70%' }}
                                            label="Tên người dùng"
                                            value={profileData.firstName}
                                            onChange={(e) => setFirstName(e.target.value)} />
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}>
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Tên đệm:{' '}
                                        </Typography>

                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            sx={{ width: '70%' }} label="Tên đệm người dùng"
                                            onChange={(e) => setMidName(e.target.value)} />
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}>
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Họ:{' '}
                                        </Typography>

                                        <TextField size="small"
                                            variant="outlined"
                                            sx={{ width: '70%' }}
                                            label="Họ người dùng"
                                            value={profileData.lastName}
                                            onChange={(e) => setLastName(e.target.value)} />
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}>
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Email:{' '}
                                        </Typography>

                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            sx={{ width: '70%' }}
                                            label="Email"
                                            value={profileData.email}
                                            onChange={(e) => setEmail(e.target.value)} />
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}>
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Vị trí:{' '}
                                        </Typography>

                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            sx={{ width: '70%' }}
                                            label="Vị trí"
                                            value={profileData.role ? profileData.role.name : ''}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid sx={4}>
                                    <Button color="primary" variant="contained" style={{ margin: 10 }}>
                                        Lưu lại
                                    </Button>
                                    <Button color="primary" variant="contained">
                                        Hủy bỏ
                                    </Button>
                                </Grid>
                            </Stack>
                        </DialogContent>
                    </Grid>
                </Grid>
            </Grid>

            {/* Đăng nhập và bảo mật Form */}
            <Grid item xs={12} sm={8} margin={10}>
                <Box sx={{
                    borderStyle: 'dashed',  // Đặt kiểu đường viền là đứt đoạn
                    borderColor: 'black',   // Đặt màu sắc của đường viền
                    borderWidth: 1,
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',  // Đặt độ bóng
                    my: 2,
                    p: 2,
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Đăng nhập và bảo mật</Typography>

                    {!isEditingPassword ? (
                        <Grid xs={12}>
                            <Grid xs={6}>
                                <Typography variant="body1" sx={{ marginLeft: 2, marginTop: 2, fontWeight: 'bold', fontSize: 14 }}><LockOpenIcon sx={{ fontSize: 20 }} /> Đổi mật khẩu</Typography>
                            </Grid>
                            <Grid xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button color="primary" variant="contained" onClick={handleEditPassword}>
                                    Chỉnh sửa
                                </Button>
                            </Grid>

                        </Grid>
                    ) : (

                        <>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="current-password">Mật khẩu hiện tại</InputLabel>
                                <Input
                                    id="current-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="new-password">Mật khẩu mới</InputLabel>
                                <Input
                                    id="new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="confirm-new-password">Xác nhận mật khẩu mới</InputLabel>
                                <Input
                                    id="confirm-new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <Stack direction="row" spacing={2} mt={2}>
                                <Button color="primary" variant="contained" onClick={handleSavePassword}>
                                    Lưu
                                </Button>
                                <Button color="primary" variant="contained" onClick={handleCancelPassword}>
                                    Bỏ qua
                                </Button>
                            </Stack>
                        </>
                    )}
                </Box>
            </Grid >

        </Grid >
    );
}
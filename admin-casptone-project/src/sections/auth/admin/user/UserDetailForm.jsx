import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Tab,
    Tabs,
    Stack,
    Grid,
    TextField,
    FormControl,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';

import SuccessAlerts from '../../../../components/alert/SuccessAlerts';
import CloseIcon from '@mui/icons-material/Close';
import { getAllWarehouse } from '../../../../data/mutation/warehouse/warehouse-mutation';
import { updateUser } from '../../../../data/mutation/user/user-mutation';
import ErrorAlerts from '~/components/alert/ErrorAlerts';
import SnackbarError from '~/components/alert/SnackbarError';
import SnackbarSuccess from '~/components/alert/SnackbarSuccess ';

const UserDetailForm = ({ users, usersId, onClose, isOpen, mode }) => {
    const [formHeight, setFormHeight] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('');
    const [editedUser, setEditedUser] = useState(null);
    const [warehouseData, setWarehouseData] = useState([]);
    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Thành công !') {
            setSuccessMessage('Thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ !');
        } else if (message === '404 NOT_FOUND') {
            setErrorMessage('Mô tả quá dài !');
        } else if (message === 'Đã xảy ra lỗi !') {
            setErrorMessage('Đã xảy ra lỗi !');
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
    const handleConfirmClose1 = () => {
        setConfirmOpen1(false);
    };

    const handleConfirmUpdate1 = () => {
        setConfirmOpen1(false);
        updateUsers();
    };

    const handleConfirm1 = () => {
        setConfirmOpen1(true);
    };

    //========================== Hàm notification của trang ==================================

    useEffect(() => {
        if (isOpen) {
            setFormHeight(1000);
        } else {
            setFormHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'create') {
            setEditedUser({
                userId: 0,
                roleName: '',
                permissions: [],
                warehouseId: 1,
            });
        } else {
            const user = users.find((o) => o.id === usersId);
            console.log(user);
            if (user) {
                // Create a new object with only the desired fields
                const editedUser = {
                    userId: user.id,
                    roleName: user.role.name,
                    permissions: [user.role.permissions],
                    warehouseId: warehouseData ? warehouseData.id : 0,
                };

                setEditedUser(editedUser);
            }
        }
    }, [users, usersId, mode]);

    useEffect(() => {
        getAllWarehouse()
            .then((respone) => {
                const data = respone.data;
                setWarehouseData(data);
                console.log(data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const user = users.find((o) => o.id === usersId);

    if (!user) {
        return null;
    }

    const updateUsers = async () => {
        try {
            if (editedUser) {
                const response = await updateUser(editedUser);

                // Handle the response as needed
                console.log('User updated:', response);
                if (response.status === '200 OK') {
                    handleSuccessMessage('Thành công !');
                }
            }
        } catch (error) {
            // Handle errors
            console.error('Error updating supplier:', error);
            handleErrorMessage('Đã xảy ra lỗi !');
        }
    };

    // const deleteSupplier = async () => {
    //     try {
    //         await deleteSuppliers(suppliersId);
    //         onClose();
    //     } catch (error) {
    //         console.error('Error deleting supplier:', error);
    //     }
    // };

    const handleEdit = (field, value) => {
        if (field === 'permissions') {
            setEditedUser((prevEditedUser) => ({
                ...prevEditedUser,
                [field]: field === 'permissions' ? value.split(',').map((permission) => permission) : value,
            }));
        } else {
            setEditedUser((prevEditedUser) => ({
                ...prevEditedUser,
                [field]: value,
            }));
        }
    };
    // const handleSave = () => {
    //     // Xử lý lưu
    // };

    // const updateSupplierStatus = async () => {
    //     try {
    //         let newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    //         const response = await editStatusSuppliers(suppliersId, newStatus);

    //         if (response.status === '200 OK') {
    //             setIsSuccess(true);
    //             setIsError(false);
    //             setSuccessMessage(response.message);
    //         }

    //         // Sử dụng hàm để cập nhật trạng thái trong danh sách categories trong CategoryPage
    //         updateSupplierStatusInList(suppliersId, newStatus);
    //         setCurrentStatus(newStatus);

    //         console.log('Product status updated:', response);
    //     } catch (error) {
    //         console.error('Error updating category status:', error);
    //         setIsError(true);
    //         setIsSuccess(false);
    //         setErrorMessage(error.response.data.message);
    //         if (error.response) {
    //             console.log('Error response:', error.response);
    //         }
    //     }
    // };

    return (
        <>
            <div
                id="userDetailForm"
                className="UserDetailForm"
                style={{
                    backgroundColor: 'white',
                    zIndex: 999,
                }}
            >
                {selectedTab === 0 && (
                    <div>
                        <Stack spacing={4} margin={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Họ và tên:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Họ và tên"
                                            sx={{ width: '70%' }}
                                            value={user ? user.lastName + user.middleName + user.firstName : ''}
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Số điện thoại:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Số điện thoại"
                                            sx={{ width: '70%' }}
                                            value={user ? user.phone : ''}
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Email:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Email"
                                            sx={{ width: '70%' }}
                                            value={user ? user.email : ''}
                                            // onChange={(e) => handleEdit('phone', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Vị trí:</Typography>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            sx={{ width: '70%', fontSize: '14px' }}
                                            value={editedUser ? editedUser.roleName : ''}
                                            onChange={(e) => handleEdit('roleName', e.target.value)}
                                        >
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="MANAGER">MANAGER</MenuItem>
                                            <MenuItem value="INVENTORY_STAFF">INVENTORY_STAFF</MenuItem>
                                            <MenuItem value="SALE_STAFF">SALE_STAFF</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Ngày tạo:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Ngày tạo"
                                            sx={{ width: '70%' }}
                                            value={user ? user.role.createdAt : ''}
                                            // onChange={(e) => handleEdit('taxCode', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="body1">Trạng thái:</Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Địa chỉ"
                                            sx={{ width: '70%' }}
                                            value={user ? user.role.status : ''}
                                        />
                                    </Grid>

                                    {editedUser && (
                                        <>
                                            {editedUser.roleName === 'INVENTORY_STAFF' && (
                                                <>
                                                    <Grid
                                                        container
                                                        spacing={1}
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        sx={{ marginBottom: 4, gap: 5 }}
                                                    >
                                                        <Typography variant="body1">Kho:</Typography>
                                                        <FormControl
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ width: '70%' }}
                                                        >
                                                            <Select
                                                                value={editedUser ? editedUser.warehouseId : ''}
                                                                onChange={(e) =>
                                                                    handleEdit('warehouseId', e.target.value)
                                                                }
                                                            >
                                                                {warehouseData.map((warehouse) => (
                                                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                                                        {warehouse.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    {/* Description for Warehouse */}
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        sx={{ marginBottom: 2 }}
                                                    >
                                                        Chọn kho để quản lý kho hàng.
                                                    </Typography>

                                                    {/* Grid for Permissions */}
                                                    <Grid
                                                        container
                                                        spacing={1}
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        sx={{ marginBottom: 4, gap: 5 }}
                                                    >
                                                        <Typography variant="body1">Quyền hạn:</Typography>
                                                        <TextField
                                                            size="small"
                                                            variant="outlined"
                                                            label="Quyền hạn"
                                                            sx={{ width: '70%' }}
                                                            value={editedUser ? editedUser.permissions : ''}
                                                            onChange={(e) => handleEdit('permissions', e.target.value)}
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Stack>
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
                        <Stack spacing={4} margin={2}>
                            <Grid container spacing={1} sx={{ gap: '10px' }}>
                                <Button variant="contained" color="primary" onClick={updateUsers}>
                                    Cập nhật
                                </Button>
                                <Button variant="contained" color="error">
                                    Thay đổi trạng thái
                                </Button>
                            </Grid>
                        </Stack>
                    </div>
                )}
                {selectedTab === 1 && (
                    <div style={{ flex: 1 }}>{/* Hiển thị nội dung cho tab "Lịch sử thanh toán" ở đây */}</div>
                )}
            </div>
        </>
    );
};

export default UserDetailForm;

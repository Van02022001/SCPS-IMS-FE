import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,

} from '@mui/material';
import React, { useState } from 'react';
// icon
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import capitalizeFirstLetter from '~/components/validation/capitalizeFirstLetter';
// api
import { createBrands } from '~/data/mutation/brand/brands-mutation';

const AddBrandItemForm = ({ open, onClose, onSave }) => {
    const [openMsg, setOpenMsg] = React.useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    //thông báo
    const [message, setMessage] = useState('');
    //========================== Hàm notification của trang ==================================
    const handleMessage = (message) => {
        setOpenMsg(true);
        // Đặt logic hiển thị nội dung thông báo từ API ở đây
        if (message === 'Update SubCategory status successfully.') {
            setMessage('Cập nhập trạng thái danh mục thành công')
        } else if (message === 'Update SubCategory successfully.') {
            setMessage('Cập nhập danh mục thành công')
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMsg(false);

    };
    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="lage" />
            </IconButton>
        </React.Fragment>
    );
    //============================================================

    const handleSave = async () => {
        const originParams = {
            name,
            description,
        }
        try {
            const response = await createBrands(originParams);
            console.log(response);

            onSave && onSave();
            // Đóng form
            onClose && onClose();
            handleMessage(response.message);
        } catch (error) {
            console.error("can't feaching category", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Thêm thương hiệu</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <Stack spacing={2} margin={2}>
                    <TextField
                        variant="outlined"
                        value={name}
                        label="Tên đơn vị"
                        onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                    />
                    <TextField
                        variant="outlined"
                        value={description}
                        multiline
                        rows={3}
                        label="Mô tả"
                        onChange={(e) => setDescription(capitalizeFirstLetter(e.target.value))}
                    />
                    <Button color="primary" variant="contained" onClick={handleSave}>
                        Tạo thêm
                        <Snackbar
                            open={open}
                            autoHideDuration={6000}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            message={message}
                            action={action}
                            style={{ bottom: '16px', right: '16px' }}
                        />
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default AddBrandItemForm;
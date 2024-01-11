import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImageSubcategory } from '~/data/mutation/image/image-mutation';
import SnackbarError from '../alert/SnackbarError';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function BoxComponent({ subcategoryId, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);

    //========================== Hàm notification của trang ==================================
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [confirmOpen1, setConfirmOpen1] = useState(false);
    const [confirmOpen2, setConfirmOpen2] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [subCategoryImages, setSubCategoryImages] = useState([]);
    const handleSuccessMessage = (message) => {
        setOpen(true);
        if (message === 'Update sub category status successfully.') {
            setSuccessMessage('Cập nhập trạng thái danh mục thành công');
        } else if (message === 'Update sub category successfully.') {
            setSuccessMessage('Cập nhập danh mục thành công');
        } else if (message === 'Xóa ảnh thành công.') {
            setSuccessMessage('Xóa ảnh thành công !');
        }
    };

    const handleErrorMessage = (message) => {
        setOpen1(true);
        if (message === 'Ảnh đã tồn tại.') {
            setErrorMessage('Ảnh đã tồn tại !');
        } else if (message === 'Invalid request') {
            setErrorMessage('Yêu cầu không hợp lệ');
        } 
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen1(false);
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

    useEffect(() => {
        // Use useEffect to trigger the upload when selectedFile changes
        if (selectedFile) {
            handleUpload(selectedFile);
        }
    }, [selectedFile]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async (file) => {
        try {
            // Gọi API upload tại đây
            const uploadResponse = await uploadImageSubcategory(subcategoryId, file);

            // Gọi callback để thông báo tải lên thành công và chuyển URL ảnh (nếu cần)
            if (onUploadSuccess) {
                onUploadSuccess(uploadResponse);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            handleErrorMessage(error.response.data.message);
        }
    };

    return (
        <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
            <label htmlFor="file-input">
                <Button component="div" variant="contained" startIcon={<CloudUploadIcon />}>
                    Thêm ảnh
                </Button>
                <SnackbarError
                    open={open1}
                    handleClose={handleClose}
                    message={errorMessage}
                    action={action}
                    style={{ bottom: '16px', right: '16px' }}
                />
            </label>
            <VisuallyHiddenInput id="file-input" type="file" onChange={handleFileChange} />
            {/* Hiển thị ảnh đã tải lên nếu có */}
        </Box>
    );
}

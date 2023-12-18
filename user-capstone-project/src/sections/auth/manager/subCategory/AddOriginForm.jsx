import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
// api
import { createOrigins } from '~/data/mutation/origins/origins-mutation';

const AddOriginForm = ({ open, onClose, onSave }) => {
  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [originName, setOriginName] = useState('');

  const [message, setMessage] = useState('');

  //========================== Hàm notification của trang ==================================
  const handleMessage = (message) => {
    setOpenAddCategory(true);
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

    setOpenAddCategory(false);

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
      name: originName,
    }
    try {
      const response = await createOrigins(originParams);
      console.log(response);
      handleMessage(response.message)
      onSave && onSave(response.message);
      // Đóng form
      onClose && onClose();
    } catch (error) {
      console.error("can't feaching category", error);
    }
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm thương hiệu</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <TextField
          label="Tên thương hiệu"
          variant="outlined"
          fullWidth
          margin="normal"
          value={originName}
          onChange={(e) => setOriginName(e.target.value)}
        />
      </DialogContent>
      <div style={{ padding: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          lưu
        </Button>
        <Snackbar
          open={openAddCategory}
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
      </div>
    </Dialog>
  );
};

export default AddOriginForm;
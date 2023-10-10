import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';
// api
import { createCategories } from '~/data/mutation/categories/categories-mutation';

const AddCategoryForm = ({ open, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleSave = async () => { 
    const categoriesParams = {
        name: categoryName,
        description: categoryDescription,
    }
    try {
    const respone = await createCategories(categoriesParams);
    console.log(respone);
    } catch (error) {
        console.error("can't feaching category",error);
    }
    };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm nhóm hàng</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên nhóm hàng"
          variant="outlined"
          fullWidth
          margin="normal"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <TextField
          label="Mô tả nhóm hàng"
          variant="outlined"
          fullWidth
          margin="normal"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
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
      </div>
    </Dialog>
  );
};

export default AddCategoryForm;
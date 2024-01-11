import React, { useState } from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImageSubcategory } from '~/data/mutation/image/image-mutation';

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
 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // Cập nhật URL của ảnh khi chọn file
    handleUpload(selectedFile)
  };

  const handleUpload = async (selectedFile) => {
    try {
        if (selectedFile) {
            // Gọi API upload tại đây
            const uploadResponse = await uploadImageSubcategory(subcategoryId, selectedFile);
            
            // Gọi callback để thông báo tải lên thành công và chuyển URL ảnh (nếu cần)
            if (onUploadSuccess) {
                onUploadSuccess(uploadResponse);
            }
        } else {
            console.warn('No file selected for upload.');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

  return (
    <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
      <label htmlFor="file-input">
        <Button component="div" variant="contained" startIcon={<CloudUploadIcon />}>
          Thêm ảnh
        </Button>
      </label>
      <VisuallyHiddenInput id="file-input" type="file" onChange={handleFileChange} />
      {/* Hiển thị ảnh đã tải lên nếu có */}
     
    </Box>
  );
}
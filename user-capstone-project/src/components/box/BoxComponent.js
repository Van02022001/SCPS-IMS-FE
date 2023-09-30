import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

export default function BoxComponent() {
    return (
        <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Thêm
                <VisuallyHiddenInput type="file" />
            </Button>
        </Box>
    );
}

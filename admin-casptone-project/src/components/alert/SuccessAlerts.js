import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function SuccessAlerts({ message }) {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="success">
                <AlertTitle>Tạo thành công</AlertTitle>
                <strong>Hãy kiểm tra lại!</strong>
            </Alert>
        </Stack>
    );
}
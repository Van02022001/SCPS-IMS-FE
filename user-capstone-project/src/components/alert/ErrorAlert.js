import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function ErrorAlerts({ errorMessage }) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Lỗi !</AlertTitle>
        {errorMessage} — <strong>Hãy kiểm tra lại!!</strong>
      </Alert>
    </Stack>
  );
}

// SnackbarAlert.js

import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarAlert = ({ open, onClose, message, action }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            message={message}
            action={action}
            style={{ bottom: '16px', right: '16px' }}
        />
    );
};

export default SnackbarAlert;

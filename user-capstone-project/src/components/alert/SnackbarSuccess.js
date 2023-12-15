import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import PropTypes from 'prop-types';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarSuccess = ({ open, handleClose, message, action, style }) => {
    const [messageToShow, setMessageToShow] = useState('');

    useEffect(() => {
      if (message) {
        setMessageToShow(message);
      }
    }, [message]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setMessageToShow('');
        handleClose(event, reason);
      };
    


    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleSnackbarClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            action={action}
            style={style}
        >
            <Alert severity="success" sx={{ width: '100%' }}>
                {messageToShow}
            </Alert>
        </Snackbar>
    );
};

SnackbarSuccess.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    message: PropTypes.node.isRequired,
    action: PropTypes.node.isRequired,
    style: PropTypes.object,
};

export default SnackbarSuccess;

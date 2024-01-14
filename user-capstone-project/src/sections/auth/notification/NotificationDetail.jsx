import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

function NotificationDetail({ notification, onClose }) {
    const { title, createdAt, description, type } = notification;

    return (
        <Dialog open={Boolean(notification)} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    {`Type: ${type}`}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    {`Created At: ${createdAt.toString()}`}
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

NotificationDetail.propTypes = {
    notification: PropTypes.shape({
        title: PropTypes.string,
        createdAt: PropTypes.instanceOf(Date),
        description: PropTypes.string,
        type: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
};

export default NotificationDetail;

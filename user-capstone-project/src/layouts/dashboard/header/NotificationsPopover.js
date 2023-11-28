import PropTypes from 'prop-types';
import { set, sub, parse  } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { getAllNotification } from '~/data/mutation/notification/notification-mutation';
import NotificationDetail from '~/sections/auth/notification/NotificationDetail';

// ----------------------------------------------------------------------

// const NOTIFICATIONS = [
//   {
//     id: faker.datatype.uuid(),
//     title: 'Your order is placed',
//     description: 'waiting for shipping',
//     avatar: null,
//     type: 'order_placed',
//     createdAt: set(new Date(), { hours: 10, minutes: 30 }),
//     isUnRead: true,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: faker.name.fullName(),
//     description: 'answered to your comment on the Minimal',
//     avatar: '/assets/images/avatars/avatar_2.jpg',
//     type: 'friend_interactive',
//     createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
//     isUnRead: true,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: 'You have new message',
//     description: '5 unread messages',
//     avatar: null,
//     type: 'chat_message',
//     createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
//     isUnRead: false,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: 'You have new mail',
//     description: 'sent from Guido Padberg',
//     avatar: null,
//     type: 'mail',
//     createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
//     isUnRead: false,
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: 'Delivery processing',
//     description: 'Your order is being shipped',
//     avatar: null,
//     type: 'order_shipped',
//     createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
//     isUnRead: false,
//   },
// ];

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [totalUnRead, setTotalUnRead] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };
  useEffect(() => {
    const userId = localStorage.getItem('id');
  
    getAllNotification(userId)
      .then((data) => {
        // Update the createdAt field to use parse function
        const formattedData = data.data.map((notification) => ({
          ...notification,
          createdAt: parse(notification.createdAt, 'dd/MM/yyyy HH:mm:ss', new Date()),
        }));
  
        setNotifications(formattedData);
        setTotalUnRead(formattedData.filter((item) => item.seen === false).length);
        console.log(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, []);
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setOpen(null); 
  };
  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} thông báo chưa đọc
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Mới
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Đã đọc
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            Coi tất cả
          </Button>
        </Box>
      </Popover>
      {selectedNotification && (
        <NotificationDetail
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      {notification.description && (
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp; {noCase(notification.description)}
        </Typography>
      )}
      {notification.type && (
        <Typography component="span" variant="body3" sx={{ color: 'text.secondary' }}>
          &nbsp; {notification.type === "XAC_NHAN_NHAP_KHO" ? 'Xác nhận nhập kho'  : 
          notification.type === "YEU_CAU_NHAP_KHO" ? 'Yêu cầu nhập kho' :
          notification.type === "DANG_TIEN_HANH_NHAP_KHO" ? 'Đang tiến hành nhập kho' 
          : ''}
        </Typography>
      )}
    </Typography>
  );


  if (notification.type === "XAC_NHAN_NHAP_KHO") {
    return {
      avatar: (
        <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />
      ),
      title,
    };
  }
  if (notification.type === "YEU_CAU_NHAP_KHO") {
    return {
      avatar: (
        <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />
      ),
      title,
    };
  }
  if (notification.type === 'DANG_TIEN_HANH_NHAP_KHO') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />
      ),
      title,
    };
  }
  // Handle unrecognized notification types or missing avatars
  return {
    avatar: null,
    title,
  };
}

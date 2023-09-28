import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, Collapse, IconButton, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// ...
// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], isReportMenuOpen, ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} isReportMenuOpen={isReportMenuOpen} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item, isReportMenuOpen }) {
  // ...
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
        ...(item.title === 'Báo cáo' && !isReportMenuOpen && {
          marginBottom: open ? '160px' : 0,
        }),
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {children ? (
        <IconButton
          sx={{ marginLeft: 'auto' }}
          onClick={handleToggle}
        >
          <ExpandMoreIcon />
        </IconButton>
      ) : null}

{children && (
  <Collapse
    in={open}
    timeout="auto"
    unmountOnExit
    sx={{
      position: 'absolute',
      top: '100%', // Hiển thị bảng dropdown bên dưới mục "Báo cáo"
      left: 0, // Đặt vị trí bên trái của bảng dropdown
      backgroundColor: 'white', // Nền màu trắng
      zIndex: 1, // Đảm bảo bảng dropdown hiển thị trên các phần tử khác
      // Các thuộc tính khác của CSS mà bạn muốn áp dụng
    }}
  >
    <List disablePadding>
      {children.map((child) => (
        <NavItem key={child.title} item={child} />
      ))}
    </List>
  </Collapse>
)}

      {info && info}
    </StyledNavItem>
  );
}


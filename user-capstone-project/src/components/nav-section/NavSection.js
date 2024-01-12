import PropTypes from 'prop-types';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();

  const handleToggle = () => {
    setOpen(!open);
  };

  const isActive = path === pathname;

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
          marginBottom: open ? '170px' : 0,
        }),
        ...(item.title === 'Hàng hóa' && !isReportMenuOpen && {
          marginBottom: open ? '50px' : 0,
        }),
        ...(item.title === 'Quản lý mục' && !isReportMenuOpen && {
          marginBottom: open ? '350px' : 0,
        }),
        ...(item.title === 'Nhập hàng' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Xuất hàng' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Xuất kho' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Quản lý kho' && !isReportMenuOpen && {
          marginBottom: open ? '150px' : 0,
        }),
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} 
        sx={{
          fontWeight: isActive ? 'bold' : 'normal',
        }} 
      />

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
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            zIndex: 1,
            width: 260
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
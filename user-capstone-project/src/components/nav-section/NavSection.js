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
          <NavItem key={item.title} item={item} isReportMenuOpen={isReportMenuOpen} depth={0}/>
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  depth: PropTypes.number,
};

function NavItem({ item, isReportMenuOpen, depth = 0 }) {
  // ...
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const handleToggle = () => {
    setOpen(!open);
  };

  const isActive = path === pathname;
  const fontSize = depth === 0 ? '16px' : '15px';

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
        ...(item.title === 'Hàng hóa' && !isReportMenuOpen && {
          marginBottom: open ? '50px' : 0,
        }),
        ...(item.title === 'Quản lý mục' && !isReportMenuOpen && {
          marginBottom: open ? '350px' : 0,
        }),
        ...(item.title === 'Nhập kho' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Xuất kho' && !isReportMenuOpen && {
          marginBottom: open ? '55px' : 0,
        }),
        ...(item.title === 'Nhập hàng' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Xuất hàng' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Chuyển kho' && !isReportMenuOpen && {
          marginBottom: open ? '200px' : 0,
        }),
        ...(item.title === 'Nhập kho nội bộ' && !isReportMenuOpen && {
          marginBottom: open ? '97px' : 0,
        }),
        ...(item.title === 'Xuất kho nội bộ' && !isReportMenuOpen && {
          marginBottom: open ? '97px' : 0,
        }),
        ...(item.title === 'Quản lý kho' && !isReportMenuOpen && {
          marginBottom: open ? '100px' : 0,
        }),
        ...(item.title === 'Kiểm kho' && !isReportMenuOpen && {
          marginBottom: open ? '50px' : 0,
        }),
        '&:hover': {
          backgroundColor: '#7ABBEF', // Change to the desired color
          color: 'black', // Change to the desired color
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} 
        sx={{
          fontWeight: isActive ? 'bold' : 'normal',
          fontSize: fontSize,
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
            width: '100%', // Use '100%' to expand to the full width
          }}
        >
          <List disablePadding>
            {children.map((child) => (
              <div style={{ paddingLeft: 10 }}>
                <NavItem key={child.title} item={child} depth={depth + 1} />
              </div>
            ))}
          </List>
        </Collapse>
      )}

      {info && info}
    </StyledNavItem>
  );
}
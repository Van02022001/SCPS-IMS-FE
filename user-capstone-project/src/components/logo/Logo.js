import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------
export const setRole = (role) => {
  localStorage.setItem('role', role);
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const removeRole = () => {
  localStorage.removeItem('role');
};


const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
<svg width="45" height="45" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.999999 4L7.62143 1L14.2429 4C14.2429 4 14.5 13.5 14.2429 14C13.9857 14.5 12 13.5 11 13C10 12.5 9 13 7.5 13C6.10544 13 5 12 4 13C3 14 2 14 0.943954 14L0.999999 4Z" fill="#5A8BFA"/>
<rect x="3.14244" y="6" width="9.16813" height="7.5" fill="#4856B5"/>
<path d="M1.10507 3.85419V14M14.3479 3.99996V14" stroke="#323668" stroke-width="0.5" stroke-linecap="round"/>
<path d="M7.72651 0.999979L1.12558 3.80494" stroke="#323668" stroke-width="0.5" stroke-linecap="round"/>
<path d="M7.7265 1L14.3744 3.82224" stroke="#323668" stroke-width="0.5" stroke-linecap="round"/>
<path d="M1.10507 14H3.14244" stroke="#323668" stroke-width="0.5"/>
<path d="M3.14244 6H12.3106" stroke="#323668" stroke-width="0.5" stroke-linecap="round"/>
<path d="M12.3106 14H14.3479" stroke="#323668" stroke-width="0.5"/>
<path d="M3.14244 14L3.14244 6" stroke="#323668" stroke-width="0.5" stroke-linecap="round"/>
<path d="M12.3106 14V6" stroke="#323668" stroke-width="0.5" stroke-linecap="round"/>
<rect x="6.80782" y="9.19998" width="1.83736" height="1.6" rx="0.2" fill="#FFB45A" stroke="#323668" stroke-width="0.2"/>
<rect x="5.78915" y="10.9" width="1.83736" height="1.6" rx="0.2" fill="#5C8EFF" stroke="#323668" stroke-width="0.2"/>
<rect x="7.8265" y="10.9" width="1.83736" height="1.6" rx="0.2" fill="#5E80EF" stroke="#323668" stroke-width="0.2"/>
<rect x="4.77046" y="12.6" width="1.83736" height="1.6" rx="0.2" fill="#5E80EF" stroke="#323668" stroke-width="0.2"/>
<rect x="6.80782" y="12.6" width="1.83736" height="1.6" rx="0.2" fill="#4C62C9" stroke="#323668" stroke-width="0.2"/>
<rect x="8.84519" y="12.6" width="1.83736" height="1.6" rx="0.2" fill="#5C8EFF" stroke="#323668" stroke-width="0.2"/>
<path d="M6.39902 11H7.01023V11.6C6.78102 11.45 6.62822 11.45 6.39902 11.6V11Z" fill="white"/>
<path d="M6.96343 11.65C6.96343 11.6776 6.98581 11.7 7.01343 11.7C7.04104 11.7 7.06343 11.6776 7.06343 11.65H6.96343ZM7.06343 11.65V11.325H6.96343V11.65H7.06343ZM7.06343 11.325V11H6.96343V11.325H7.06343Z" fill="#323668"/>
<path d="M6.35216 11.65C6.35216 11.6776 6.37455 11.7 6.40216 11.7C6.42977 11.7 6.45216 11.6776 6.45216 11.65H6.35216ZM6.45216 11.65V11.325H6.35216V11.65H6.45216ZM6.45216 11.325V11H6.35216V11.325H6.45216Z" fill="#323668"/>
<path d="M6.41577 11.6608L6.5618 11.5604L6.70783 11.46" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M6.99988 11.6608L6.85385 11.5604L6.70783 11.46" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M5.38034 12.7H5.99155V13.3C5.76235 13.15 5.60954 13.15 5.38034 13.3V12.7Z" fill="white"/>
<path d="M5.94475 13.35C5.94475 13.3776 5.96714 13.4 5.99475 13.4C6.02237 13.4 6.04475 13.3776 6.04475 13.35H5.94475ZM6.04475 13.35V13.025H5.94475V13.35H6.04475ZM6.04475 13.025V12.7H5.94475V13.025H6.04475Z" fill="#323668"/>
<path d="M5.33348 13.35C5.33348 13.3776 5.35587 13.4 5.38348 13.4C5.4111 13.4 5.43348 13.3776 5.43348 13.35H5.33348ZM5.43348 13.35V13.025H5.33348V13.35H5.43348ZM5.43348 13.025V12.7H5.33348V13.025H5.43348Z" fill="#323668"/>
<path d="M5.39709 13.3608L5.54312 13.2604L5.68915 13.16" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M5.98121 13.3608L5.83518 13.2604L5.68915 13.16" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M7.41769 12.7H8.0289V13.3C7.7997 13.15 7.6469 13.15 7.41769 13.3V12.7Z" fill="white"/>
<path d="M7.98212 13.35C7.98212 13.3776 8.00451 13.4 8.03212 13.4C8.05973 13.4 8.08212 13.3776 8.08212 13.35H7.98212ZM8.08212 13.35V13.025H7.98212V13.35H8.08212ZM8.08212 13.025V12.7H7.98212V13.025H8.08212Z" fill="#323668"/>
<path d="M7.37084 13.35C7.37084 13.3776 7.39322 13.4 7.42084 13.4C7.44845 13.4 7.47084 13.3776 7.47084 13.35H7.37084ZM7.47084 13.35V13.025H7.37084V13.35H7.47084ZM7.47084 13.025V12.7H7.37084V13.025H7.47084Z" fill="#323668"/>
<path d="M7.43444 13.3608L7.58047 13.2604L7.7265 13.16" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M8.01856 13.3608L7.87253 13.2604L7.7265 13.16" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M9.45506 12.7H10.0663V13.3C9.83707 13.15 9.68427 13.15 9.45506 13.3V12.7Z" fill="white"/>
<path d="M10.0195 13.35C10.0195 13.3776 10.0419 13.4 10.0695 13.4C10.0971 13.4 10.1195 13.3776 10.1195 13.35H10.0195ZM10.1195 13.35V13.025H10.0195V13.35H10.1195ZM10.1195 13.025V12.7H10.0195V13.025H10.1195Z" fill="#323668"/>
<path d="M9.40821 13.35C9.40821 13.3776 9.43059 13.4 9.45821 13.4C9.48582 13.4 9.50821 13.3776 9.50821 13.35H9.40821ZM9.50821 13.35V13.025H9.40821V13.35H9.50821ZM9.50821 13.025V12.7H9.40821V13.025H9.50821Z" fill="#323668"/>
<path d="M9.47181 13.3608L9.61784 13.2604L9.76387 13.16" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M10.0559 13.3608L9.9099 13.2604L9.76387 13.16" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M8.43639 11H9.0476V11.6C8.81839 11.45 8.66559 11.45 8.43639 11.6V11Z" fill="white"/>
<path d="M9.0008 11.65C9.0008 11.6776 9.02318 11.7 9.0508 11.7C9.07841 11.7 9.1008 11.6776 9.1008 11.65H9.0008ZM9.1008 11.65V11.325H9.0008V11.65H9.1008ZM9.1008 11.325V11H9.0008V11.325H9.1008Z" fill="#323668"/>
<path d="M8.38953 11.65C8.38953 11.6776 8.41192 11.7 8.43953 11.7C8.46714 11.7 8.48953 11.6776 8.48953 11.65H8.38953ZM8.48953 11.65V11.325H8.38953V11.65H8.48953ZM8.48953 11.325V11H8.38953V11.325H8.48953Z" fill="#323668"/>
<path d="M8.45313 11.6608L8.59916 11.5604L8.74519 11.46" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M9.03725 11.6608L8.89122 11.5604L8.74519 11.46" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M7.41769 9.29999H8.0289V9.89999C7.7997 9.74999 7.6469 9.74999 7.41769 9.89999V9.29999Z" fill="white"/>
<path d="M7.98212 9.94999C7.98212 9.9776 8.00451 9.99999 8.03212 9.99999C8.05973 9.99999 8.08212 9.9776 8.08212 9.94999H7.98212ZM8.08212 9.94999V9.62499H7.98212V9.94999H8.08212ZM8.08212 9.62499V9.29999H7.98212V9.62499H8.08212Z" fill="#323668"/>
<path d="M7.37084 9.94999C7.37084 9.9776 7.39322 9.99999 7.42084 9.99999C7.44845 9.99999 7.47084 9.9776 7.47084 9.94999H7.37084ZM7.47084 9.94999V9.62499H7.37084V9.94999H7.47084ZM7.47084 9.62499V9.29999H7.37084V9.62499H7.47084Z" fill="#323668"/>
<path d="M7.43444 9.96076L7.58047 9.86039L7.7265 9.76001" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
<path d="M8.01856 9.96076L7.87253 9.86039L7.7265 9.76001" stroke="#323668" stroke-width="0.1" stroke-linecap="round"/>
</svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }
  const userRole = getRole();
  let dashboardPath;
  
  switch (userRole) {
    case 'MANAGER':
      dashboardPath = "/dashboard/app";
      break;
    case 'INVENTORY_STAFF':
      dashboardPath = "/inventory-staff/dashboard";
      break;
    case 'sale':
      dashboardPath = "/sale-staff";
      break;
    default:
      dashboardPath = "/dashboard/app";
  }
  
  return (
    <Link to={dashboardPath} component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;

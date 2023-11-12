import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FormControlContext from '@mui/material/FormControl/FormControlContext';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { createUser } from '../../../data/mutation/user/user-mutation';
import SuccessAlerts from '../../../components/alert/SuccessAlerts';
import ErrorAlerts from '../../../components/alert/ErrorAlerts';
import capitalizeFirstLetter from '../../../components/validation/capitalizeFirstLetter';

const UserForm = () => {
  const [open, openchange] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleName, setRoleName] = useState('');

  // thông báo
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const userParams = {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        roleName,
      };

      const response = await createUser(userParams);
      console.log('User created:', response);
      if (response.status === '200 OK') {
        setIsSuccess(true);
        setIsError(false);
        setSuccessMessage('Tạo thành công');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setIsError(true);
      setIsSuccess(false);
      if (error.response?.data?.message === 'Email already exists.') {
        setErrorMessage('Email đã tồn tại.');
      } else if (error.response?.data?.message === 'Phone already exists.') {
        setErrorMessage('Phone đã tồn tại.');
      }
      if (error.response) {
        console.error('Error response:', error.response);
      }
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <DialogContent style={{ width: '90%' }}>
          <div style={{ marginLeft: 100 }}>
            <Stack spacing={4} margin={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                      Tên:{' '}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Tên đầu người dùng"
                      sx={{ width: '70%' }}
                      onChange={(e) => setFirstName(capitalizeFirstLetter(e.target.value))}
                      value={firstName}
                    />
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                      Tên đệm:{' '}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Tên đệm người dùng"
                      sx={{ width: '70%' }}
                      onChange={(e) => setMiddleName(capitalizeFirstLetter(e.target.value))}
                      value={middleName}
                    />
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                      Họ:{' '}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Họ người dùng"
                      onChange={(e) => setLastName(capitalizeFirstLetter(e.target.value))}
                      sx={{ width: '70%' }}
                      value={lastName}
                    />
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                      Email:{' '}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ width: '70%' }}
                    />
                  </Grid>

                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: 4, gap: 5 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                      Số điện thoại:{' '}
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      label="Số điện thoại"
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{ width: '70%' }}
                    />
                  </Grid>

                  <FormControl size="small" variant="outlined" sx={{ width: '100%' }}>
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ marginBottom: 4, gap: 5 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                        Tên vị trí:{' '}
                      </Typography>

                      <Select
                        size="small"
                        labelId="group-label"
                        id="group-select"
                        sx={{ width: '70%', fontSize: '14px' }}
                        onChange={(e) => setRoleName(e.target.value)}
                      >
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="MANAGER">MANAGER</MenuItem>
                        <MenuItem value="INVENTORY_STAFF">INVENTORY_STAFF</MenuItem>
                        <MenuItem value="SALE_STAFF">SALE_STAFF</MenuItem>
                      </Select>
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>
              {isSuccess && <SuccessAlerts message={successMessage} />}
              {isError && <ErrorAlerts errorMessage={errorMessage} />}
              <Button color="primary" variant="contained" onClick={handleSubmit}>
                Tạo
              </Button>
            </Stack>
          </div>
        </DialogContent>
      </div>
    </>
  );
};

export default UserForm;

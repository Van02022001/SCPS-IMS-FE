import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField } from "@mui/material";
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react";

const UserForm = () => {
    const [open, openchange] = useState(false);

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <Dialog fullWidth maxWidth="sm">
                    <DialogTitle>User Registeration  <IconButton style={{ float: 'right' }}><CloseIcon color="primary" /></IconButton>  </DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                        <Stack spacing={2} margin={2}>
                            <TextField variant="outlined" label="Username" />
                            <TextField variant="outlined" label="Password" />
                            <TextField variant="outlined" label="Email" />
                            <TextField variant="outlined" label="Phone" />

                            <Button color="primary" variant="contained">Submit</Button>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default UserForm;
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const OdersForm = () => {


    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent>

                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker label="Today's Date" /></LocalizationProvider>
                        <TextField
                            variant="outlined"
                            label="Username"

                        />
                        <Button
                            color="primary"
                            variant="contained"

                        >
                            Add Product
                        </Button>
                        <Typography variant="h6">Product List:</Typography>
                        <List>
                            {/* {productList.map((product, index) => ( */}
                            <ListItem >
                                <ListItemText />
                                <Button
                                    color="error"
                                    variant="contained"

                                >
                                    Remove
                                </Button>
                            </ListItem>
                            {/* ))} */}
                        </List>
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
            </div>
        </>
    );
}

export default OdersForm;
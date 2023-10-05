import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react";
import { createUser } from "../../../data/mutation/user/user-mutation";


const UserForm = () => {
    const [open, openchange] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [midName, setMidName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [roleName, setRoleName] = useState("");

    const handleSubmit = async () => {
        try {
            const userParams = {
                firstName,
                midName,
                lastName,
                email,
                phone,
                roleName,
            };

            const response = await createUser(userParams);
            console.log("User created:", response);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent style={{ width: '90%' }}>
                    <Stack spacing={2} margin={2}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <TextField variant="outlined" label="Tên đầu người dùng" onChange={(e) => setFirstName(e.target.value)} />
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <TextField variant="outlined" label="Tên đệm người dùng" onChange={(e) => setMidName(e.target.value)} />
                                </Grid>
                            </Grid>

                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <TextField variant="outlined" label="Tên cuối người dùng" onChange={(e) => setLastName(e.target.value)} />
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <TextField variant="outlined" label="Email" onChange={(e) => setEmail(e.target.value)} />
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ marginBottom: 4, gap: 5 }}
                                >
                                    <TextField variant="outlined" label="Số điện thoại" onChange={(e) => setPhone(e.target.value)} />
                                </Grid>
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
                                    <Grid xs={8.5}>
                                        <Select
                                            size="small"
                                            labelId="group-label"
                                            id="group-select"
                                            sx={{ width: '90%', fontSize: '14px' }}
                                            onChange={(e) => setRoleName(e.target.value)}
                                        >
                                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                                            <MenuItem value="MANAGER">MANAGER</MenuItem>
                                            <MenuItem value="INVENTORY-STAFF">INVENTORY-STAFF</MenuItem>
                                            <MenuItem value="SALE-STAFF">SALE-STAFF</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Button color="primary" variant="contained" onClick={handleSubmit}>Tạo</Button>
                    </Stack>
                </DialogContent>
            </div>
        </>
    );
}

export default UserForm;
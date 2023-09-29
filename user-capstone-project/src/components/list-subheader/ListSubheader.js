import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        width: '100px',
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '8px 20px 8px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export default function CustomizedSelects() {
    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <div>
            <FormControl sx={{ m: 0.2 }} variant="standard">
                <InputLabel htmlFor="demo-customized-textbox">Dài</InputLabel>
                <BootstrapInput id="demo-customized-textbox" />
            </FormControl>
            <FormControl sx={{ m: 0.2 }} variant="standard">
                <InputLabel htmlFor="demo-customized-textbox">Rộng</InputLabel>
                <BootstrapInput id="demo-customized-textbox" />
            </FormControl>
            <FormControl sx={{ m: 0.2 }} variant="standard">
                <InputLabel sx={{ width: '60px' }} id="demo-customized-select-label">
                    đơn vị
                </InputLabel>
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={age}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                >
                    <MenuItem value="">
                        <em>Đơn vị</em>
                    </MenuItem>
                    <MenuItem value={10}>mm</MenuItem>
                    <MenuItem value={20}>cm</MenuItem>
                    <MenuItem value={30}>m</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

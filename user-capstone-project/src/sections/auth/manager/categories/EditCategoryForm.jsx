import {
    Button,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Card,
} from '@mui/material';
import { useEffect, useState } from 'react';
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

//components
import BoxComponent from '~/components/box/BoxComponent';

//api
import { getAllCategories } from '~/data/mutation/categories/categories-mutation';
import { getAllUnit, getAllUnitMeasurement } from '~/data/mutation/unit/unit-mutation';
import { getAllOrigins } from '~/data/mutation/origins/origins-mutation';
import { editSubCategory } from '~/data/mutation/subCategory/subCategory-mutation';

// api

const EditCategoryForm = ({ open, product, handleClose }) => {
    console.log(product);

    // mở popup form

    // form để call api
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minStockLevel, setMinStockLevel] = useState('');
    const [maxStockLevel, setMaxStockLevel] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [diameter, setDiameter] = useState('');
    const [categories_id, setCategories_id] = useState([]);
    const [unit_id, setUnits_id] = useState([]);
    const [unit_mea_id, setUnit_mea_id] = useState([]);
    const [origins_id, setOrigins_id] = useState([]);

    const [tab1Data, setTab1Data] = useState({});

    const handleTab1DataChange = (event) => {
        // Cập nhật dữ liệu cho tab 1 tại đây
        setTab1Data({ ...tab1Data, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (product) {
            // Lấy dữ liệu từ `product` và đặt giá trị cho các trường
            setName(product.name || '');
            setDescription(product.description || '');

            // Ví dụ: Tên nhóm hàng (category) và đơn vị (unit)
            setCategories_id([product.categories[0].name] || []);
            setUnits_id([product.unit.id] || []);
        }
    }, [product]);

    useEffect(() => {
        getAllCategories()
            .then((respone) => {
                const data = respone.data;
                setCategories_id(data);
            })
            .catch((error) => console.error('Error fetching categories:', error));

        getAllUnit()
            .then((respone) => {
                const data = respone.data;
                setUnits_id(data);
            })
            .catch((error) => console.error('Error fetching units:', error));
        getAllUnitMeasurement()
            .then((respone) => {
                const data = respone.data;
                setUnit_mea_id(data);
            })
            .catch((error) => console.error('Error fetching units measurement:', error));
        getAllOrigins()
            .then((respone) => {
                const data = respone.data;
                setOrigins_id(data);
            })
            .catch((error) => console.error('Error fetching origins:', error));
    }, []);

    const handleSaveClick = () => {
        const updatedProduct = {
            id: product.id, // Make sure to include the product ID
            name,
            description,
            minStockLevel,
            maxStockLevel,
            categories_id: categories_id,
            unit_id,
            length,
            width,
            height,
            diameter,
            unit_mea_id,
        };

        editSubCategory(updatedProduct)
            .then((response) => {
                console.log('Product updated successfully', response);
                handleClose();
            })
            .catch((error) => {
                console.error('Error updating product:', error);
            });
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <DialogContent style={{ width: '90%' }}>
                    <div style={{ marginLeft: 100 }}>
                        <Stack spacing={4} margin={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 5 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Tên hàng hóa:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            label="Tên hàng"
                                            sx={{ width: '70%' }}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
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
                                            Mô tả về hàng hóa:{' '}
                                        </Typography>
                                        <TextField
                                            size="small"
                                            label="Mô tả"
                                            variant="outlined"
                                            sx={{ width: '70%' }}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
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
                                                Nhóm hàng:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '90%', fontSize: '14px' }}
                                                    value={tab1Data.categories_id}
                                                    onChange={handleTab1DataChange}
                                                    name="categories_id"
                                                >
                                                    {categories_id.map((category) => (
                                                        <MenuItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </FormControl>

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
                                                Đơn vị:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '90%', fontSize: '14px' }}
                                                    value={tab1Data.unit_id}
                                                    onChange={handleTab1DataChange}
                                                    name="unit_id"
                                                >
                                                    {unit_id.map((unit) => (
                                                        <MenuItem
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                            }}
                                                            key={unit.id}
                                                            value={unit.id}
                                                        >
                                                            {unit.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5} sx={{ marginLeft: 8 }}>
                                    {/* <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 2 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Tồn kho:{' '}
                                        </Typography>
                                        <TextField size="small" variant="outlined" sx={{ width: '70%' }} />
                                    </Grid> */}

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
                                                Đơn vị đo lường:{' '}
                                            </Typography>
                                            <Grid xs={8.5}>
                                                <Select
                                                    size="small"
                                                    labelId="group-label"
                                                    id="group-select"
                                                    sx={{ width: '98%', fontSize: '16px' }}
                                                    value={tab1Data.unit_mea_id}
                                                    onChange={handleTab1DataChange}
                                                    name="unit_mea_id"
                                                >
                                                    {unit_mea_id.map((unit_mea) => (
                                                        <MenuItem key={unit_mea.id} value={unit_mea.id}>
                                                            {unit_mea.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </FormControl>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 2 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Định mức tồn:{' '}
                                        </Typography>
                                        <div>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Ít nhất"
                                                    value={minStockLevel}
                                                    onChange={(e) => setMinStockLevel(e.target.value)}
                                                    sx={{ width: '208px' }}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Nhiều nhất"
                                                    value={maxStockLevel}
                                                    onChange={(e) => setMaxStockLevel(e.target.value)}
                                                    sx={{ width: '208px' }}
                                                />
                                            </FormControl>
                                        </div>
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ marginBottom: 4, gap: 2 }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                            Kích thước:{' '}
                                        </Typography>
                                        <div style={{ display: 'flex' }}>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều dài"
                                                    value={length}
                                                    onChange={(e) => setLength(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều rộng"
                                                    value={width}
                                                    onChange={(e) => setWidth(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Chiều cao"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ m: 0.2 }} variant="standard">
                                                <TextField
                                                    id="demo-customized-textbox"
                                                    label="Đường kính"
                                                    value={diameter}
                                                    onChange={(e) => setDiameter(e.target.value)}
                                                />
                                            </FormControl>
                                        </div>
                                    </Grid>

                                    {/* Thêm các trường khác ở đây */}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ gap: '20px' }}>
                                <BoxComponent />
                                <BoxComponent />
                                <BoxComponent />
                            </Grid>
                            <Grid container spacing={1} sx={{ gap: '20px' }}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveClick}
                                >
                                    Lưu
                                </Button>
                                <Button color="primary" variant="outlined" startIcon={<ClearIcon />}>
                                    Hủy
                                </Button>
                            </Grid>
                        </Stack>
                    </div>
                </DialogContent>
            </div>
        </>
    );
};

export default EditCategoryForm;

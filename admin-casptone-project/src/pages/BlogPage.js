import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Grid, Button, Container, Stack, Typography , Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, TextField } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import UserForm from '../sections/auth/home/UserForm';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpen(true)}>
            New Post
          </Button>
          <Dialog fullWidth maxWidth="sm" open={open} >
                    <DialogTitle>User Registeration   </DialogTitle>
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
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}

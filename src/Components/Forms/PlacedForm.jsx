import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../Config/supabase.client';
import { useAuth } from '../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../UI/Post/post-services';
import { useAccountType } from '../../Hooks/useAccountType';
import { Container, TextField, Button } from '@mui/material';

export default function PlacedForm() {
  const [formData, setFormData] = React.useState({});
  const { currentUser } = useAuth();
  const [accountType] = useAccountType(currentUser);
  const [files, setFiles] = React.useState({ offerLetter: null, photo: null });

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['jobPosts'],
    queryFn: () => fetchData(currentUser, accountType),
    refetchOnWindowFocus: false,
  });

  const inputHandler = (e) => {
    const id = e.target.name;
    const value = e.target.value;

    setFormData((prevData) => {
      return { ...prevData, [id]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    uploadFiles();
    createRecord();

    alert('Details are saved! Thank you.');

    // navigate(-1);
  };

  const { mutate: createRecord } = useMutation({
    mutationFn: uploadPlacementDetails,
  });

  const { mutate: uploadFiles, isLoading: isUploading } = useMutation({
    mutationFn: uploadStudentFiles,
  });

  async function uploadPlacementDetails() {
    let { company, jobPackage } = formData;

    const post = postsData?.filter((job) => {
      if (job.company_name === company) return job.post_id;
    });

    const { data: offerLetterUrl } = supabase.storage
      .from('placed')
      .getPublicUrl(`${currentUser.uid}/${company}/${currentUser.displayName}offerLetter`);

    const { data: photoUrl } = supabase.storage
      .from('placed')
      .getPublicUrl(`${currentUser.uid}/${company}/${currentUser.displayName}photo`);

    const { data: alreadyExist, error: alreadyExistError } = await supabase
      .from('Placed_Students')
      .delete()
      .eq('student_id', currentUser.uid)
      .eq('job_id', post[0].post_id);

    if (alreadyExistError) {
      alert('Failed, please try again!');
      throw new Error('Failed to create post!');
    }

    const { data, error } = await supabase
      .from('Placed_Students')
      .upsert({
        id: Date.now().toString(),
        company_name: company,
        package: jobPackage,
        student_id: currentUser.uid,
        job_id: post[0].post_id,
        offer_letter: offerLetterUrl.publicUrl,
        photo_url: photoUrl.publicUrl,
      })
      .select();

    if (error) {
      alert('Failed! Please try again.');
      throw new Error('Failed to create post!');
    }

    return data;
  }

  async function uploadStudentFiles() {
    let { offerLetter, photo } = files;

    const { data, error } = supabase.storage
      .from('placed')
      .upload(`${currentUser.uid}/${formData.company}/${currentUser.displayName}offerLetter`, offerLetter, {
        upsert: true,
        cacheControl: 0,
      });

    if (error) {
      alert('Offer Letter and photo not uploaded. Please try again!');
      return;
    }

    const { data: ada, error: photoUploadingError } = supabase.storage
      .from('placed')
      .upload(`${currentUser.uid}/${formData.company}/${currentUser.displayName}photo`, photo, {
        upsert: true,
        cacheControl: 0,
      });

    if (photoUploadingError) alert('Photo not uploaded please try again');
  }

  if (isLoading) return;

  return (
    <>
      <Container maxWidth="xs">
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextField
            required
            id="outlined-select-currency"
            select
            label="Company Name"
            fullWidth
            onChange={(e) => {
              inputHandler(e);
            }}
            name="company"
            margin="normal"
          >
            {postsData
              .filter((post) => post.alreadyApplied)
              .map((post) => (
                <MenuItem key={post.company_name} value={post.company_name}>
                  {post.company_name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            required
            id="outlined-basic"
            label="Package"
            variant="outlined"
            fullWidth
            name="jobPackage"
            placeholder="Please specify in terms of LPA"
            onChange={(e) => {
              inputHandler(e);
            }}
            margin="normal"
          />

          <Button variant="contained" component="label" fullWidth style={{ marginTop: '15px' }}>
            Upload offer letter
            <input
              hidden
              accept="application/pdf"
              multiple
              type="file"
              onChange={(e) =>
                setFiles((prev) => {
                  return { ...prev, offerLetter: e.target.files[0] };
                })
              }
            />
          </Button>
          <Button variant="contained" component="label" style={{ marginTop: '15px' }} fullWidth>
            Upload Your Photo (Passport size)
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={(e) =>
                setFiles((prev) => {
                  return { ...prev, photo: e.target.files[0] };
                })
              }
            />
          </Button>

          <Button type="submit" variant="contained" fullWidth style={{ marginTop: '15px' }} disabled={isUploading}>
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
}

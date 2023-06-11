import { Avatar } from '@mui/material';
import { Container } from '@mui/material';
import { Stack } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAuth } from '../../Context/AuthContext';
import { FormControl } from '@mui/material';
import { TextField } from '@mui/material';
import StandardButton from '../UI/Buttons/Button';
import { useState } from 'react';
import { findDepartmentId, updateDepartmentLiking } from './Page-Utils';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAccountType } from '../../Hooks/useAccountType';

export default function Profile({ queryClient }) {
  const { currentUser } = useAuth();
  const departmentData = queryClient.getQueryData(['departmentDetails']);
  const [accountType] = useAccountType(currentUser);

  const [profileData, setProfileData] = useState({
    department: departmentData?.[0]?.department || '',
    stream: departmentData?.[0]?.stream || '',
  });

  const jobData = queryClient.getQueryData(['jobPosts']);
  const navigate = useNavigate();

  const postsCount = jobData?.filter((job) => job.teacher_id === currentUser.uid).length;

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setProfileData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const saveHandler = () => {
    const departmentId = findDepartmentId(profileData);
    updateDepartmentData([currentUser, departmentId]);
  };

  const { mutate: updateDepartmentData } = useMutation({
    mutationFn: ([currentUser, departmentId]) => {
      return updateDepartmentLiking([currentUser, departmentId]);
    },

    onSuccess: () => {
      alert('Data is saved');
      navigate('/Dashboard');
    },
  });

  const streamValues = () => {
    const stream = profileData.department;
    if (stream === 'Commerce') {
      return [<MenuItem value={'COMMERCE-BCOM'}>BCOM</MenuItem>, <MenuItem value={'COMMERCE-MCOM'}>MCOM</MenuItem>];
    }

    if (stream === 'Science') {
      return [
        <MenuItem value={'COMPSCI-BSC'}>BSC (3rd Year)</MenuItem>,
        <MenuItem value={'COMPSCI-MSC'}>MSC (Both Years)</MenuItem>,
      ];
    }

    return [];
  };

  return (
    <>
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Stack direction="column" spacing={2}>
          <Avatar sx={{ width: 80, height: 80, alignSelf: 'center' }} src={currentUser.photoURL}>
            {currentUser.displayName[0]}
          </Avatar>

          <TextField label="Name" id="standard-size-normal" defaultValue={currentUser.displayName} disabled />

          <FormControl required sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-required-label">Department</InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required department"
              label="Department *"
              onChange={handleChange}
              name="department"
              value={profileData.department}
            >
              <MenuItem value={'Science'}>Science</MenuItem>
              <MenuItem value={'Commerce'}>Commerce</MenuItem>
            </Select>
          </FormControl>

          <FormControl required sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-required-label">Stream</InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required stream"
              label="Stream *"
              onChange={handleChange}
              name="stream"
              value={profileData.stream}
            >
              {streamValues().map((node) => node)}
            </Select>
          </FormControl>

          {accountType === 'Teacher' && (
            <TextField label="Job Posts" id="standard-size-normal" defaultValue={postsCount} disabled />
          )}

          {accountType === 'Student' && (
            <TextField label="Applied Jobs" id="standard-size-normal" defaultValue={postsCount} disabled />
          )}

          <StandardButton operation={saveHandler}>Save</StandardButton>
        </Stack>
      </Container>
    </>
  );
}

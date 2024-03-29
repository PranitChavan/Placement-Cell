import styled from '@mui/material/styles/styled';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import MenuItems from '../Menu';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Tags from './Tags';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../../../Context/AuthContext/';
import { useAccountType } from '../../../Hooks/useAccountType';
import timeAgo from '../../../Utils/displayTimeSincePostCreated';
import CircularColor from '../Progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJobPost, fetchData, updatePostsOnUI, updateTagsOnPost } from './post-services';
import { applyHandler } from '../../../Utils/applyHandler';
import { deleteApplicant } from '../../../Utils/helpers';
import Container from '@mui/material/Container';
import './Post.css';
import Postbutton from '../Buttons/PostButton';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Post() {
  const [expanded, setExpanded] = useState(false);
  const { currentUser } = useAuth();
  const [accountType] = useAccountType(currentUser);
  const queryClient = useQueryClient();
  const departmentData = queryClient.getQueryData(['departmentDetails']);

  const {
    data: postsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['jobPosts'],
    queryFn: () => fetchData(currentUser, accountType, departmentData),
    refetchOnWindowFocus: false,
    enabled: departmentData?.length > 0,
  });

  // async function test(departmentData) {
  //   const dept = departmentData.map((dept) => dept.department_id);
  //   const { data, error } = await supabase.rpc('get_job_posts_test', {
  //     department_ids: dept,
  //   });

  //   // console.log(data);

  //   return data;
  // }

  // const { data: postsData1 } = useQuery({
  //   queryKey: ['jobPosts1'],
  //   queryFn: () => test(departmentData),
  //   refetchOnWindowFocus: false,
  //   enabled: departmentData?.length > 0,
  // });

  // console.log(postsData1);

  const { mutate: deletePost } = useMutation({
    mutationFn: (postId) => {
      deleteJobPost(currentUser, postId);
    },

    onSuccess: (_, postId) => {
      queryClient.setQueryData(['jobPosts'], (oldData) => {
        return updatePostsOnUI(oldData, postId);
      });
    },
  });

  const { mutate: applyForJob, isLoading: isApplyForLoading } = useMutation({
    mutationFn: (postId) => {
      return applyHandler(postId, currentUser);
    },

    onSuccess: (_, postId) => {
      queryClient.setQueryData(['jobPosts'], (oldData) => {
        return updateTagsOnPost(oldData, postId, 'APPLY');
      });
    },
  });

  const { mutate: deleteJobApplication } = useMutation({
    mutationFn: ([studentId, postId]) => {
      return deleteApplicant([studentId, postId]);
    },

    onSuccess: (_, [studentId, postId]) => {
      queryClient.setQueryData(['jobPosts'], (oldData) => {
        return updateTagsOnPost(oldData, postId, 'DEL');
      });
    },
  });

  const handleExpandClick = (index) => {
    setExpanded((prevState) => {
      const newExpanded = { ...prevState };
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  if (isLoading || isFetching) {
    return (
      <>
        <CircularColor styles={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }} />
      </>
    );
  }

  const renderPosts = (data) => {
    return (
      <Container>
        <Grid container spacing={4} justifyItems="center" style={{ marginTop: '50px' }}>
          {data?.map((post) => {
            const {
              post_id,
              job_title,
              company_name,
              location,
              skills_required,
              description,
              created_at,
              name,
              teacher_id,
              alreadyApplied,
            } = post;

            return (
              <Grid key={post_id} item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 400, marginTop: '20px', background: '#383838' }} className="a" variant="outlined">
                  <CardHeader
                    // avatar={
                    //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={currentUser.photoURL}>
                    //     {currentUser.displayName.split('')[0]}
                    //   </Avatar>
                    // }
                    action={
                      <MenuItems
                        deletePost={deletePost}
                        postId={post_id}
                        type={accountType}
                        hasStudentApplied={alreadyApplied}
                        deleteJobApplication={deleteJobApplication}
                      />
                    }
                    titleTypographyProps={{ variant: 'h5', fontSize: '22px', marginTop: '5px' }}
                    subheaderTypographyProps={{
                      fontSize: 20,
                    }}
                    title={job_title}
                    subheader={company_name}
                  ></CardHeader>
                  {/* {
          <CardMedia
            component="img"
            height="200"
            image="https://ujeiwlvvlzxwdiaiupvj.supabase.co/storage/v1/object/public/resumes/public/d222aa19-f828-49ed-adec-6d32a85140b9.jfif"
            alt="Paella dish"
          />
        } */}
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="start" gap={1} mt={-3.5}>
                      <LocationOnIcon />
                      <Typography color="text.secondary" variant="h6">
                        {location}
                      </Typography>
                    </Stack>

                    <Tags items={skills_required.split(',')} />

                    <Typography variant="body2" mt={1.5}>
                      {description}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={1} mt={1}>
                      <AccessTimeIcon style={{ fontSize: '18px' }} />
                      <Typography style={{ fontSize: '13px' }} color="text.secondary">
                        {created_at
                          ? `Posted ${timeAgo(created_at)} by ${currentUser.uid === teacher_id ? 'You' : name}`
                          : 'Posted Just Now'}
                      </Typography>
                    </Stack>

                    {/* {accountType !== 'Teacher' && alreadyApplied && (
                      <Chip
                        label="Already Applied"
                        color="success"
                        style={{ marginTop: '15px', fontSize: '15px' }}
                        size="medium"
                        variant="outlined"
                      />
                    )} */}

                    <Postbutton state={{ accountType, alreadyApplied, operation: applyForJob, post_id }} />
                  </CardContent>

                  <CardActions disableSpacing>
                    <ExpandMore
                      expand={expanded[post_id]}
                      onClick={() => handleExpandClick(post_id)}
                      aria-expanded={expanded[post_id]}
                      aria-label="show more"
                      style={{ marginTop: '-30px' }}
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded[post_id]} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>Requirements</Typography>

                      <ul>
                        <li>0-1 year Work experience as a Python Developer </li>
                        <li>
                          Good Knowledge of at least two popular Python framework (like Django, Tornado, Flask or Pyramid)
                        </li>
                        <li>knowledge on Pandas and Numpy in Python </li>
                        <li>Knowledge of object-relational mapping (ORM) </li>
                        <li>Able to integrate multiple data sources and databases into one system </li>
                        <li>Good problem-solving skills</li>
                      </ul>

                      <Typography paragraph>Required Qualification</Typography>

                      <ul>
                        <li>B. Sc/B.Tech/B.E. in Any Specialization or equivalent.</li>
                        <li>Any Postgraduate in Any Specialization.</li>
                      </ul>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    );
  };

  return <>{renderPosts(postsData)}</>;
}

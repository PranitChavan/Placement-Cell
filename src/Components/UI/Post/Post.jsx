import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState, useMemo, useCallback } from 'react';
import MenuItems from '../Menu';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Tags from './Tags';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../../../Context/AuthContext';
import { supabase } from '../../../Config/supabase.client';
import { useAccountType } from '../../../Hooks/useAccountType';
import timeAgo from '../../../Utils/displayTimeSincePostCreated';
import Chip from '@mui/material/Chip';
import CircularColor from '../Progress';
import { checkIfStudentHasAlreadyApplied } from '../../../Utils/helpers';
import './Post.css';

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

export default function Post({ post }) {
  const [expanded, setExpanded] = useState(false);
  const { currentUser } = useAuth();
  const [nowAddedPost, setNowAddedPost] = useState(post);
  const [jobPostsFromDB, setJobPostsFromDb] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [updateUI, setUpdateUI] = useState('');
  const accountType = useAccountType(currentUser);

  const handleExpandClick = (index) => {
    setExpanded((expanded) => ({
      ...expanded,
      [index]: !expanded[index],
    }));
  };

  useEffect(() => {
    let isApiSubscribed = true;

    async function fetchData() {
      if (isApiSubscribed) {
        let { data, error } = await supabase.rpc('get_job_posts');

        if (error) return;
        const postsData = await checkIfStudentHasAlreadyApplied(data, currentUser);

        setJobPostsFromDb(postsData);
        setIsDataFetched(true);
      }
    }

    fetchData();

    return () => {
      isApiSubscribed = false;
    };
  }, []);

  useEffect(() => {
    setNowAddedPost((prev) => {
      return [...prev, ...post];
    });
  }, [post]);

  useEffect(() => {
    const filtered = jobPostsFromDB.filter((job) => job.post_id === updateUI);

    let idToFind = updateUI;

    let newObject = { ...filtered[0], alreadyApplied: true };

    const arr = jobPostsFromDB.map((obj) => {
      if (obj.post_id === idToFind) {
        return newObject;
      }
      return obj;
    });

    setJobPostsFromDb(arr);
  }, [updateUI]);

  /****  */
  function filterJobPosts(data, id) {
    if (!data.length) return data;
    return data.filter((post) => post.post_id !== id);
  }

  async function deleteJobPost(id) {
    const { data, error } = await supabase.from('Job_Posts').update({ deleted_by: currentUser.uid }).eq('post_id', id);

    if (error) {
      alert('Failed to delete, please try again!');
      return;
    }

    setNowAddedPost(filterJobPosts(nowAddedPost, id));
    setJobPostsFromDb(filterJobPosts(jobPostsFromDB, id));

    await supabase.from('Student_Applications').delete().eq('post_id', id);
  }

  const allData = [...jobPostsFromDB, ...nowAddedPost];

  const renderPosts = (data) => {
    return (
      <Grid container spacing={4} justifyItems="center" style={{ marginTop: '10px' }}>
        {data.map((post) => {
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
                      deletePost={deleteJobPost}
                      postId={post_id}
                      type={accountType}
                      hasStudentApplied={alreadyApplied}
                      setUpdateUI={setUpdateUI}
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
                  <Stack direction="row" alignItems="center" justifyContent="start" gap={1} mt={-3}>
                    <LocationOnIcon />
                    <Typography color="text.secondary" variant="h6">
                      {location}
                    </Typography>
                  </Stack>

                  <Tags items={skills_required.split(',')} />

                  <Typography variant="body2" mt={2}>
                    {description}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1} mt={2}>
                    <AccessTimeIcon style={{ fontSize: '18px' }} />
                    <Typography style={{ fontSize: '13px' }} color="text.secondary">
                      {created_at
                        ? `Posted ${timeAgo(created_at)} by ${currentUser.uid === teacher_id ? 'You' : name}`
                        : 'Posted Just Now'}
                    </Typography>
                  </Stack>

                  {accountType !== 'Teacher' && alreadyApplied ? (
                    <Chip
                      label="Already Applied"
                      color="success"
                      style={{ marginTop: '15px', fontSize: '15px' }}
                      size="medium"
                      variant="outlined"
                    />
                  ) : (
                    ''
                  )}
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
    );
  };

  const renderLoading = () => {
    return (
      <>
        {!isDataFetched && (
          <CircularColor styles={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }} />
        )}
      </>
    );
  };

  return <>{allData.length > 0 ? renderPosts(allData) : renderLoading()}</>;
}

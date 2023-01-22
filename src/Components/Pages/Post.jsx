import { useEffect, useState } from 'react';
import { supabase } from '../../Config/supabase.client';
import { useAuth } from '../../Context/AuthContext';
import Button from '../UI/Button';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { VscLocation } from 'react-icons/vsc';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useAccountType } from '../../Hooks/useAccountType';
import { applyHandler } from '../../Utils/applyHandler';
import timeAgo from '../../Utils/displayTimeSincePostCreated';
import { exportExcel } from '../../Utils/exportExcel';
import './Post.css';
import { useNavigate } from 'react-router-dom';

function Post({ post }) {
  const [jobPostsFromDB, setJobPostsFromDb] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nowAddedPost, setNowAddedPost] = useState(post);
  const accountType = useAccountType(currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    let isApiSubscribed = true;

    async function getAllPostsData() {
      if (isApiSubscribed) {
        await fetchData();
      }
    }

    getAllPostsData();

    return () => {
      isApiSubscribed = false;
    };
  }, []);

  useEffect(() => {
    setNowAddedPost((prev) => {
      return [...prev, ...post];
    });
  }, [post]);

  async function fetchData() {
    const { data, error } = await supabase.from('Job_Posts').select('*').is('deleted_by', null);

    if (error) return;
    setJobPostsFromDb(data);
  }

  function filterJobPosts(data, id) {
    if (!data.length) return data;
    return data.filter((post) => post.post_id !== id);
  }

  async function deleteJobPost(id) {
    setNowAddedPost(filterJobPosts(nowAddedPost, id));
    setJobPostsFromDb(filterJobPosts(jobPostsFromDB, id));

    const { data, error } = await supabase.from('Job_Posts').update({ deleted_by: currentUser.uid }).eq('post_id', id);
    if (error) {
      alert('Failed to delete, please try again!');
      return;
    }

    await supabase.from('Student_Applications').update({ status: 'Inactive' }).eq('post_id', id);
  }

  function renderJobPost(postsData) {
    return postsData.map((post) => {
      const { post_id, job_title, company_name, location, skills_required, description, created_at } = post;

      return (
        <div className="col-lg-6 my-2 " key={post_id}>
          <div className="card cardshadow" style={{ backgroundColor: '#D9D9D9' }}>
            <div className="card-body">
              <div style={{ display: 'flex' }}>
                <AiOutlineClockCircle className="time-icon" /> <p>{created_at ? timeAgo(created_at) : 'Just Now'}</p>
              </div>

              <div className="modal-header">
                <h5 className="modal-title fs-3">{job_title}</h5>

                <button
                  onClick={() => deleteJobPost(post_id)}
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className={accountType === 'Student' ? 'hide' : 'btn-close'}
                ></button>
              </div>
              <h5 className="card-title text-primary fs-4 mb-3">{company_name}</h5>
              <p className="fs-5">
                <VscLocation className="iconn" /> {location}
              </p>
              <button disabled className="btn bg-dark text-warning border border-0 mb-4">
                <small className="text-warning">{skills_required?.split(',').join(',')}</small>
              </button>
              <br></br>
              <ReactReadMoreReadLess
                charLimit={50}
                readMoreText={<p className="text-dark fw-bold text-primary">....show more</p>}
                readLessText={<p className="text-dark fw-bold text-primary">....show less</p>}
              >
                {description}
              </ReactReadMoreReadLess>
              {accountType === 'Student' && (
                <Button
                  className="btn btn-success col-12"
                  onClick={() => {
                    applyHandler(post_id, currentUser);
                  }}
                >
                  Apply
                </Button>
              )}
              {/* {accountType === 'Teacher' && (
                <Button
                  className={'btn btn-success col-12'}
                  onClick={() => {
                    dataForExcelExport(company_name, post_id, currentUser);
                  }}
                >
                  Download
                </Button>
              )} */}
              {accountType === 'Teacher' && (
                <Button
                  className={'btn btn-success col-12'}
                  onClick={() => {
                    navigate('/Applicants', { state: { post_id } });
                  }}
                >
                  View Applicants
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    });
  }

  const allData = [...jobPostsFromDB, ...nowAddedPost];

  return (
    <>
      <h1 className="text-white mb-4"> Postings</h1>
      <div className="container">
        <div className="row">{allData.length > 0 ? renderJobPost(allData) : <h1 style={{ textAlign: 'center' }}></h1>}</div>
      </div>
    </>
  );
}

export default Post;

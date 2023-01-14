import { useEffect, useState } from 'react';
import { arrayRemove, collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/firebaseCfg';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, query, where, getDoc } from 'firebase/firestore';
import Button from './Button';
import { utils, writeFileXLSX } from 'xlsx';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { VscLocation } from 'react-icons/vsc';
import './Post.css';

function Post({ loggedInUser, post }) {
  const [jobPostsFromDB, setJobPostsFromDb] = useState([]);
  const [appliedStudentsData, setAppliedStudentsData] = useState([]);
  const { accountType, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nowAddedPost, setNowAddedPost] = useState(post);

  const collectionRef = collection(db, 'Teachers');
  const collectionRefStudents = collection(db, 'Students');

  const washingtonRef = doc(db, 'Students', currentUser.uid);
  const washingtonRef1 = doc(db, 'Teachers', currentUser.uid);

  useEffect(() => {
    let isApiSubscribed = true;

    async function getAllPostsData() {
      if (isApiSubscribed) {
        await getAllPosts();
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

  async function getAllPosts() {
    const postsData = [];
    try {
      if (accountType(currentUser) === 'Teacher') {
        try {
          const docRef = doc(db, 'Teachers', currentUser.uid);

          const res = await getDoc(docRef);

          if (!res.data()) return;

          setJobPostsFromDb(() => {
            return [...res.data().posts];
          });

          return;
        } catch (err) {
          console.log(err);
        }
      }

      const response = await getDocs(collectionRef);

      response.docs.map((item) => {
        postsData.push({ ...item.data().posts });
      });

      formatData(postsData);
    } catch (err) {
      console.log(err);
    }
  }

  function formatData(data) {
    if (!data) return;

    const formattedData = [];

    data.forEach((d) => {
      for (let key in d) {
        formattedData.push(d[key]);
      }
    });

    setJobPostsFromDb(formattedData);
  }

  async function saveJobPostingDetails(id) {
    const alreadyApplied = await setDisabledOrEnabled(id);

    if (alreadyApplied) {
      alert('You have already applied for this job');
      return;
    }

    if (!loggedInUser) {
      alert('Please fill the form before applying for this job.');
      return;
    }

    if (loggedInUser && !loggedInUser.isFormFilled) {
      alert('Please fill the form before applying for this job.');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(washingtonRef, {
        jobsAppliedFor: arrayUnion(id),
      });

      alert('Your application was successfully sent!');
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  function exportExcel(d, companyName) {
    const formattedData = [];

    d.forEach((data) => {
      const { contact, email, name, qualifications, passingYear, resumeUrl } = data;
      formattedData.push({ contact, email, name, qualifications, passingYear, resumeUrl });
    });

    if (!formattedData.length) return;

    let wb = utils.book_new();
    let ws = utils.json_to_sheet(formattedData);
    utils.book_append_sheet(wb, ws, 'mySheet');
    writeFileXLSX(wb, `${companyName}.xlsx`);
  }

  async function downloadHandler(jobId, companyName) {
    const data = [];

    try {
      const queryD = query(collectionRefStudents, where('jobsAppliedFor', 'array-contains', jobId));

      const res = await getDocs(queryD);

      res.docs.map((item) => {
        data.push({ ...item.data(), id: item.id });
      });

      setAppliedStudentsData(data);

      if (data.length === 0) alert('No Students have applied yet!');

      exportExcel(data, companyName);
    } catch (err) {
      console.log(err);
    }
  }

  function filterJobPosts(data, id) {
    if (!data.length) return data;
    return data.filter((post) => post.id !== id);
  }

  async function deleteJobPosting(id) {
    try {
      const data = [...jobPostsFromDB, ...nowAddedPost];
      const dataToBeDeleted = data.filter((post) => post.id === id);

      setNowAddedPost(filterJobPosts(nowAddedPost, id));
      setJobPostsFromDb(filterJobPosts(jobPostsFromDB, id));

      if (!dataToBeDeleted?.length) return;

      await updateDoc(washingtonRef1, {
        posts: arrayRemove(dataToBeDeleted[0]),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function setDisabledOrEnabled(jobId) {
    try {
      const colRef = doc(db, 'Students', currentUser.uid);
      const res = await getDoc(colRef);

      const jobsAppliedByCurrentUser = [...res.data().jobsAppliedFor];

      return jobsAppliedByCurrentUser.some((id) => id === jobId);
    } catch (err) {
      console.log(err);
    }
  }

  function renderJobPost(postsData) {
    return postsData.map((post) => {
      const { id, jobTitle, companyName, location, skillsRequired, jobDescription } = post;
      return (
        <div className="col-lg-6 my-2 " key={id}>
          <div className="card cardshadow" style={{ backgroundColor: '#D9D9D9' }}>
            <div className="card-body">
              <div className="modal-header">
                <h5 className="modal-title fs-3">{jobTitle}</h5>
                <button
                  onClick={() => deleteJobPosting(id)}
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  className={accountType(currentUser) === 'Student' ? 'hide' : 'btn-close'}
                ></button>
              </div>

              <h5 className="card-title text-primary fs-4 mb-3">{companyName}</h5>
              <p className="fs-5">
                <VscLocation className="iconn" /> {location}
              </p>

              <button disabled className="btn bg-dark text-warning border border-0 mb-4">
                <small className="text-warning">{skillsRequired?.split(',').join(',')}</small>
              </button>
              <br></br>

              <ReactReadMoreReadLess
                charLimit={50}
                readMoreText={<p className="text-dark fw-bold text-primary">....show more</p>}
                readLessText={<p className="text-dark fw-bold text-primary">....show less</p>}
              >
                {jobDescription}
              </ReactReadMoreReadLess>

              {accountType(currentUser) === 'Student' && (
                <Button onClick={() => saveJobPostingDetails(id)} className="btn btn-success col-12">
                  Apply
                </Button>
              )}

              <Button
                onClick={() => downloadHandler(id, companyName)}
                className={accountType(currentUser) === 'Student' ? 'hide' : 'btn btn-success col-12'}
              >
                Download
              </Button>
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
        <div className="row">
          {allData.length > 0 ? renderJobPost(allData) : <h1 style={{ textAlign: 'center' }}>Loading Posts....</h1>}
        </div>
      </div>
    </>
  );
}

export default Post;

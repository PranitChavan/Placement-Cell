import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchApplicantsData } from '../../Utils/fetchApplicantsData';
import { getJobDetails } from '../../Utils/misc';
import Default from '../../Assets/default.jpg';
import Button from '../UI/Button';
import { exportExcel } from '../../Utils/exportExcel';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';
import { supabase } from '../../Config/supabase.client';
import './Applicants.css';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const {
    state: { postId },
  } = location;

  const confirmDeletion = (studentId) => {
    confirm({ description: 'Are you sure that you would like to delete this applicantion?', title: 'Delete application' })
      .then(() => {
        deleteApplicant(studentId);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const fetchData = async () => {
      const applicantsData = await fetchApplicantsData(postId);
      setApplicants(applicantsData);

      const companyData = await getJobDetails(postId);
      setCompanyDetails(companyData);
    };

    fetchData();
  }, []);

  async function deleteApplicant(studentId) {
    const { data, error } = await supabase
      .from('Student_Applications')
      .delete()
      .match({ student_id: studentId, post_id: companyDetails[0].post_id });

    if (error) {
      alert('Something went wrong. Please try again!');
      return;
    }

    const filteredData = applicants.filter((app) => app.student_id !== studentId);

    setApplicants([...filteredData]);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }} className="idk container">
        <h1 style={{ marginTop: '30px', marginBottom: '30px', color: '#d8e1e7' }}>
          {companyDetails[0]?.company_name} Applicants
        </h1>
        <Button
          style={{ maxWidth: '100px' }}
          className={'btn btn-success'}
          onClick={() => {
            exportExcel(applicants, companyDetails[0].company_name);
          }}
        >
          Export to Excel
        </Button>
      </div>

      {!applicants.length ? (
        <h1 style={{ color: '#8c988c' }}>No Students have applied yet</h1>
      ) : (
        <table className="table table-dark container table-bordered">
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'center' }}>
                Name
              </th>
              <th scope="col" style={{ textAlign: 'center' }}>
                Email
              </th>
              <th scope="col" style={{ textAlign: 'center' }}>
                Resume
              </th>
              <th scope="col" style={{ textAlign: 'center' }}>
                Actions
              </th>
            </tr>
          </thead>
          {applicants.map((app, i) => {
            return (
              <tbody key={i}>
                <tr>
                  <th scope="row" style={{ width: '23%' }}>
                    <a>
                      <img
                        style={{ borderRadius: '50%', height: '45px', weight: '20px', marginRight: '10px' }}
                        src={app.profile_picture}
                        alt={'User Image'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = Default;
                        }}
                      />
                      {app.name}
                    </a>
                  </th>

                  <td scope="row" style={{ width: '20%' }}>
                    {app.email}
                  </td>
                  <td scope="row" style={{ width: '10%', textAlign: 'center' }}>
                    <a href={app.resume_url} target="_blank">
                      Link
                    </a>
                  </td>
                  <td scope="row" style={{ width: '20%', textAlign: 'center' }}>
                    <Button onClick={() => confirmDeletion(app.student_id)}>Delete</Button>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      )}
      <div className="header container">
        <Button
          style={{ maxWidth: '100px' }}
          className={'btn btn-success'}
          onClick={() => {
            navigate('/Dashboard');
          }}
        >
          Go Back
        </Button>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchApplicantsData } from '../../Utils/fetchApplicantsData';
import { getJobDetails } from '../../Utils/helpers';
import Button from '../UI/Button';
import { exportExcel } from '../../utils/exportExcel';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Config/supabase.client';
import ApplicantsTable from '../UI/Table';
import CircularColor from '../UI/Progress';
import './Applicants.css';

export default function Applicants() {
  const [applicants, setApplicants] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    state: { postId },
  } = location;

  useEffect(() => {
    const fetchData = async () => {
      const [applicantsData, companyData] = await Promise.all([fetchApplicantsData(postId), getJobDetails(postId)]);

      setApplicants(applicantsData);
      setCompanyDetails(companyData);

      setIsDataFetched(true);
    };

    fetchData();
  }, []);

  async function updateTable(studentId) {
    const filteredData = applicants.filter((app) => app.student_id !== studentId);

    setApplicants([...filteredData]);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }} className="idk container">
        <h1 style={{ marginTop: '30px', marginBottom: '30px', color: '#d8e1e7' }}>
          {companyDetails && companyDetails.length > 0 ? (
            `${companyDetails[0].company_name} Applicants`
          ) : (
            <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />
          )}
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

      {!applicants ? (
        <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />
      ) : (
        <ApplicantsTable data={applicants} postId={postId} updateTable={updateTable} />
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

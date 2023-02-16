import { useLocation } from 'react-router-dom';
import { fetchApplicantsData } from '../../Utils/fetchApplicantsData';
import { getJobDetails } from '../../Utils/helpers';
import Button from '@mui/material/Button';
import { exportExcel } from '../../utils/exportExcel';
import { useNavigate } from 'react-router-dom';
import ApplicantsTable from '../UI/Table';
import CircularColor from '../UI/Progress';
import { useQuery } from '@tanstack/react-query';
import './Applicants.css';

export default function Applicants() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    state: { postId },
  } = location;

  const {
    data: applicantsData,
    isLoadingApplicants,
    isFetching,
  } = useQuery({
    queryKey: ['applicants'],
    queryFn: () => fetchApplicantsData(postId),
    refetchOnWindowFocus: false,
  });

  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: ['companyData'],
    queryFn: () => getJobDetails(postId),
    refetchOnWindowFocus: false,
  });

  if (isLoadingApplicants || isLoadingCompanyData || isFetching) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }} className="idk container">
        <h1 style={{ marginTop: '30px', marginBottom: '30px', color: '#d8e1e7' }}>{companyData[0].company_name}</h1>
        <Button
          variant="contained"
          style={{ background: '#2ea44f', color: 'white' }}
          onClick={() => {
            exportExcel(applicantsData, companyData[0].company_name);
          }}
        >
          Export to Excel
        </Button>
      </div>

      <ApplicantsTable data={applicantsData} postId={postId} />

      <div className="header container">
        <Button
          variant="contained"
          style={{ background: '#2ea44f', color: 'white' }}
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

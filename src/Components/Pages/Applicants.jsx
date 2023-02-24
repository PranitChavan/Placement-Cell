import { useLocation } from 'react-router-dom';
import { fetchApplicantsData } from '../../Utils/fetchApplicantsData';
import { getJobDetails } from '../../Utils/helpers';
import { exportExcel } from '../../utils/exportExcel';
import { useNavigate } from 'react-router-dom';
import ApplicantsTable from '../UI/Table';
import CircularColor from '../UI/Progress';
import { useQuery } from '@tanstack/react-query';
import StandardButton from '../UI/Button';
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
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }} className="idk container">
        <h1 style={{ marginTop: '70px', marginBottom: '30px', color: '#d8e1e7', textAlign: 'center' }}>
          {companyData[0].company_name}
        </h1>

        <StandardButton operation={() => exportExcel(applicantsData, companyData[0].company_name)}>
          Export to Excel
        </StandardButton>
      </div>

      <ApplicantsTable data={applicantsData} postId={postId} />

      <div className="header container">
        <StandardButton operation={() => navigate('/Dashboard')}>Go Back</StandardButton>
      </div>
    </>
  );
}
